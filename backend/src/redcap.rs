pub mod redcap {
    use std::collections::HashMap;

    use actix_multipart_extract::{Multipart, MultipartForm};
    use serde::{Deserialize, Serialize};
    use std::fs;

    use crate::{structs::structs::ApplicationError, Key};

    #[derive(Debug, Serialize, Deserialize, Clone)]
    #[serde(untagged)]
    enum Response {
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
        pub module_name: String,
        pub responses: Option<String>, // JSON of type HashMap<String, Response>
        pub entries: Option<Vec<i8>>,
        pub response_time: String,
        pub response_time_in_ms: i64,
        pub alert_time: String,
        pub platform: String,
    }
    #[derive(Serialize, Debug, Deserialize, Clone)]
    struct Payload {
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
        keys: Vec<Key>,
    ) -> Result<(), ApplicationError> {
        let key = keys.iter().find(|k| k.study_id == data.study_id);
        if key.is_none() {
            return Err(ApplicationError::NoCorrespondingAPIKey);
        }
        if data.entries.is_none() && data.responses.is_none() {
            return Err(ApplicationError::NoEntriesOrResponses);
        }

        let mut record: HashMap<String, Response> = HashMap::from([
            (
                "redcap_repeat_instrument".to_string(),
                Response::Text(data.module_name.clone()),
            ),
            (
                "redcap_repeat_instance".to_string(),
                Response::Text("new".to_string()),
            ),
            (
                format!("record_id"),
                Response::Text(data.user_id.to_string()),
            ),
            // ("user_id", Response::Text(data.user_id)),
            // ("study_id", Response::Text(data.study_id)),
            (
                format!("response_time_in_ms_{}", &data.module_index),
                Response::Integer(data.response_time_in_ms),
            ),
            (
                format!("response_time_{}", &data.module_index),
                Response::Text(data.response_time.clone()),
            ),
        ]);

        if let Some(ref response) = data.responses {
            let response: HashMap<String, Response> = serde_json::from_str(response.as_str())?;
            println!("Importing response for study {:#?}", response);
            response.iter().for_each(|(k, v)| {
                record.insert(format!("{}_{}", k, data.module_index), v.clone());
            });
            println!("{:#?}", record);
        };

        if let Some(entries) = data.entries.clone() {
            record.insert("entries".to_string(), Response::Entries(entries));
        };

        let payload = Payload {
            token: key.unwrap().api_key.to_string(),
            content: "record".to_string(),
            format: "json".to_string(),
            r#type: "flat".to_string(),
            // record_id: "1".to_string(),
            data: serde_json::to_string(&vec![record]).unwrap(),
        };
        println!("{:#?}", payload);

        let file = fs::read_to_string("payload.json")?;
        let mut json: Vec<Payload> = serde_json::from_str(&file)?;
        json.push(payload.clone());
        fs::write("payload.json", serde_json::to_string_pretty(&json)?)?;

        let response = reqwest::Client::new()
            .post(REDCAP_API_URL)
            .form(&payload)
            .send()
            .await;
        // println!("{:#?}", response);

        match response {
            Ok(response) => {
                if response.status().is_success() {
                    println!(
                        "Successfully imported response: {:#?}",
                        response.text().await.unwrap()
                    );
                    Ok(())
                } else if response.status() == reqwest::StatusCode::FORBIDDEN {
                    println!("Forbidden: {:#?}", response.text().await.unwrap());
                    Err(ApplicationError::RedcapAuthenicationError)
                } else {
                    let content = response.text().await.unwrap();
                    println!("Error: {:#?}", content);
                    Err(ApplicationError::RedcapError(content))
                }
            }
            Err(e) => {
                println!("Error: {:#?}", e);
                Err(ApplicationError::RedcapError(e.to_string()))
            }
        }
    }
}
