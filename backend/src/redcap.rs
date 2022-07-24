pub mod redcap {
    use std::collections::HashMap;

    use serde::{Deserialize, Serialize};
    use serde_json::json;

    use crate::{structs::structs::ApplicationError, Key};

    #[derive(Debug, Serialize, Deserialize, Clone)]
    #[serde(untagged)]
    enum Response {
        Integer(i32),
        Text(String),
        Entries(Vec<i8>),
    }

    #[derive(Serialize, Deserialize, Debug)]
    pub struct Submission {
        data_type: String,
        user_id: String,
        study_id: String,
        module_index: i32,
        module_name: String,
        responses: Option<String>, // JSON of type HashMap<String, Response>
        entries: Option<Vec<i8>>,
        response_time: String,
        response_time_in_ms: i32,
        alert_time: String,
        platform: String,
    }
    #[derive(Serialize, Debug)]
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

    pub async fn import_response(data: Submission, keys: Vec<Key>) -> Result<(), ApplicationError> {
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
                Response::Text(data.module_name),
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
                Response::Text(data.response_time),
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

        if let Some(entries) = data.entries {
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
                    Err(ApplicationError::RedcapAuthenicationError)
                } else {
                    Err(ApplicationError::RedcapError(
                        response.text().await.unwrap(),
                    ))
                }
            }
            Err(e) => Err(ApplicationError::RedcapError(e.to_string())),
        }
    }
}
