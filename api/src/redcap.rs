use crate::{error::Error, Key, ACTIVE_DB, DB};
use mongodb::bson::doc;
use rocket_db_pools::Connection;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Clone)]
#[serde(untagged)]
enum Entry {
    Integer(i64),
    Text(String),
    Entries(Vec<i8>),
}

#[derive(Serialize, FromForm)]
pub struct Log {
    pub data_type: String,
    pub user_id: String,
    pub study_id: String,
    pub module_index: i32,
    pub platform: String,

    pub page: String,
    pub event: String,
    pub timestamp: String,
    pub timestamp_in_ms: i64,
}

#[derive(Serialize, FromForm)]
pub struct Response {
    pub data_type: String,
    pub user_id: String,
    pub study_id: String,
    pub module_index: i32,
    pub platform: String,

    pub module_name: String,
    pub responses: Option<String>, // JSON of type HashMap<String, Response>
    pub entries: Option<Vec<i8>>,
    pub response_time: String,
    pub response_time_in_ms: i64,
    pub alert_time: String,
}

#[derive(Serialize, Deserialize)]
pub struct Payload {
    token: String,
    content: String,
    format: String,
    r#type: String,
    data: String,
}

const REDCAP_API_URL: &str = "https://tuspl22-redcap.srv.mwn.de/redcap/api/";

pub async fn import_response(db: Connection<DB>, res: Response) -> Result<(), Error> {
    // Get API key from DB
    let key = db
        .database(ACTIVE_DB)
        .collection::<Key>("keys")
        .find_one(doc! { "study_id": &res.study_id }, None)
        .await?;
    if key.is_none() {
        return Err(Error::NoCorrespondingAPIKey);
    }
    let key = key.unwrap();

    // Create Redcap record, including module index for uniqueness
    let mut record: HashMap<String, Entry> = HashMap::from([
        (
            "redcap_repeat_instrument".to_string(),
            Entry::Text(res.module_name.clone()),
        ),
        (
            "redcap_repeat_instance".to_string(),
            Entry::Text("new".to_string()),
        ),
        (
            "record_id".to_string(),
            Entry::Text(res.user_id.to_string()),
        ),
        (
            format!("response_time_in_ms_{}", &res.module_index),
            Entry::Integer(res.response_time_in_ms),
        ),
        (
            format!("response_time_{}", &res.module_index),
            Entry::Text(res.response_time.clone()),
        ),
    ]);

    if let Some(ref response) = res.responses {
        let response: HashMap<String, Entry> = serde_json::from_str(response.as_str())?;
        response.iter().for_each(|(k, v)| {
            record.insert(format!("{}_{}", k, res.module_index), v.clone());
        });
    };

    if let Some(entries) = res.entries.clone() {
        record.insert("entries".to_string(), Entry::Entries(entries));
    };
    db.database(ACTIVE_DB)
        .collection::<HashMap<String, Entry>>("responses")
        .insert_one(&record, None)
        .await?;

    let payload = Payload {
        token: key.api_key,
        content: "record".to_string(),
        format: "json".to_string(),
        r#type: "flat".to_string(),
        data: serde_json::to_string(&vec![record]).unwrap(),
    };

    let response = reqwest::Client::new()
        .post(REDCAP_API_URL)
        .form(&payload)
        .send()
        .await?;

    match response.status() {
        reqwest::StatusCode::OK => Ok(()),
        reqwest::StatusCode::FORBIDDEN => {
            println!("Forbidden: {:#?}", response.text().await.unwrap());
            Err(Error::RedcapAuthenication)
        }
        _ => {
            let content = response.text().await.unwrap();
            println!("Error: {content:#?}");
            Err(Error::Redcap(content))
        }
    }
}
