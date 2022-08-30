pub mod redcap {
    use actix_web::web;
    use chrono::prelude::*;
    use std::collections::HashMap;

    use actix_multipart_extract::{Multipart, MultipartForm};
    use serde::{Deserialize, Serialize};
    use std::fs;

    use crate::{Error, State};

    #[derive(Debug, Serialize, Deserialize, Clone)]
    #[serde(untagged)]
    enum Entry {
        Integer(i64),
        Text(String),
        Entries(Vec<i8>),
    }

    #[derive(Serialize, Deserialize, Debug, MultipartForm)]
    pub struct Submission {
        #[multipart(max_size = 5MB)]
        pub data_type: String,
        pub user_id: String,
        pub study_id: String,
        pub module_index: i32,
        pub platform: String,

        // Survey Response
        pub module_name: Option<String>,
        pub responses: Option<String>, // JSON of type HashMap<String, Response>
        pub entries: Option<Vec<i8>>,
        pub response_time: Option<String>,
        pub response_time_in_ms: Option<i64>,
        pub alert_time: Option<String>,

        // Log
        pub page: Option<String>,
        pub event: Option<String>,
        pub timestamp: Option<String>,
        pub timestamp_in_ms: Option<i64>,
    }

    #[derive(Serialize, Deserialize, Debug, MultipartForm)]
    pub struct Log {
        #[multipart(max_size = 5MB)]
        pub data_type: String,
        pub user_id: String,
        pub study_id: String,
        pub module_index: i32,
        pub platform: String,
        pub page: Option<String>,
        pub event: Option<String>,
        pub timestamp: Option<String>,
        pub timestamp_in_ms: Option<i64>,
    }

    #[derive(Serialize, Deserialize, Debug, MultipartForm)]
    pub struct Response {
        #[multipart(max_size = 5MB)]
        pub data_type: String,
        pub user_id: String,
        pub study_id: String,
        pub module_index: i32,
        pub platform: String,

        // Survey Response
        pub module_name: Option<String>,
        pub responses: Option<String>, // JSON of type HashMap<String, Response>
        pub entries: Option<Vec<i8>>,
        pub response_time: Option<String>,
        pub response_time_in_ms: Option<i64>,
        pub alert_time: Option<String>,
    }

    #[derive(Serialize, Debug, Deserialize, Clone)]
    pub struct Payload {
        token: String,
        content: String,
        format: String,
        r#type: String,
        data: String,
        // record_id: i32,
    }
    // #[derive(Serialize, Deserialize, Debug)]
    // struct Record {
    //     redcap_repeat_instrument: String,
    //     redcap_repeat_instance: String,
    //     record_id: String,
    //     user_id: String,
    //     study_id: String,
    //     response_time_in_ms: i32,
    //     response_time: String,
    //     raw_data: String,
    //     entries: Option<Vec<i8>>,
    //     hash_map: HashMap<String, Response>,
    // }

    const REDCAP_API_URL: &str = "https://tuspl22-redcap.srv.mwn.de/redcap/api/";

    pub async fn import_response(
        data: Multipart<Submission>,
        state: web::Data<State>,
        // keys: HashMap<String, String>,
        // mut payloads: MutexGuard<HashMap<i64, Payload>>,
    ) -> Result<(), Error> {
        let keys = state.keys.lock().unwrap().clone();
        let mut payloads = state.payloads.lock().unwrap();

        if data.event.is_some() {
            println!(
                "Received log entry at {} from {} on page {} with event {}",
                data.timestamp
                    .as_ref()
                    .unwrap_or(&"unknown time".to_string()),
                data.user_id,
                data.page.as_ref().unwrap_or(&"unknown page".to_string()),
                data.event.as_ref().unwrap_or(&"unknown event".to_string()),
            );
            // Log handling
            return Ok(());
        }
        let key = keys.get(&data.study_id);
        if key.is_none() {
            return Err(Error::NoCorrespondingAPIKey);
        }
        if data.entries.is_none() && data.responses.is_none() {
            return Err(Error::NoEntriesOrResponses);
        }

        let mut record: HashMap<String, Entry> = HashMap::from([
            (
                "redcap_repeat_instrument".to_string(),
                Entry::Text(
                    data.module_name
                        .as_ref()
                        .unwrap_or(&"unknown_module".to_string())
                        .clone(),
                ),
            ),
            (
                "redcap_repeat_instance".to_string(),
                Entry::Text("new".to_string()),
            ),
            (
                "record_id".to_string(),
                Entry::Text(data.user_id.to_string()),
            ),
            // ("user_id", Response::Text(data.user_id)),
            // ("study_id", Response::Text(data.study_id)),
            (
                format!("response_time_in_ms_{}", &data.module_index),
                Entry::Integer(data.response_time_in_ms.unwrap_or(0)),
            ),
            (
                format!("response_time_{}", &data.module_index),
                Entry::Text(
                    data.response_time
                        .as_ref()
                        .unwrap_or(&"unknown time".to_string())
                        .clone(),
                ),
            ),
        ]);
        if let Some(ref response) = data.responses {
            println!("{:#?}", response);
            let response: HashMap<String, Entry> = serde_json::from_str(response.as_str())?;
            println!("Importing response for study {:#?}", response);
            response.iter().for_each(|(k, v)| {
                record.insert(format!("{}_{}", k, data.module_index), v.clone());
            });
            println!("{:#?}", record);
        };

        if let Some(entries) = data.entries.clone() {
            record.insert("entries".to_string(), Entry::Entries(entries));
        };

        let payload = Payload {
            token: key.unwrap().to_string(),
            content: "record".to_string(),
            format: "json".to_string(),
            r#type: "flat".to_string(),
            data: serde_json::to_string(&vec![record]).unwrap(),
        };
        println!("{:#?}", payload);

        payloads.insert(Utc::now().timestamp_millis(), payload.clone());
        fs::write(
            "payloads.json",
            serde_json::to_string_pretty(&payloads.clone())?,
        )?;

        let response = reqwest::Client::new()
            .post(REDCAP_API_URL)
            .form(&payload)
            .send()
            .await?;
        println!("{:#?}", response);

        match response.status() {
            reqwest::StatusCode::OK => {
                println!(
                    "Successfully imported response: {:#?}",
                    response.text().await.unwrap()
                );
                Ok(())
            }
            reqwest::StatusCode::FORBIDDEN => {
                println!("Forbidden: {:#?}", response.text().await.unwrap());
                Err(Error::RedcapAuthenicationError)
            }
            _ => {
                let content = response.text().await.unwrap();
                println!("Error: {:#?}", content);
                Err(Error::RedcapError(content))
            }
        }
    }
}
