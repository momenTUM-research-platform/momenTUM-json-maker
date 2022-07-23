mod redcap;
mod structs;
mod studies;
use std::io::Read;

pub use crate::studies::studies::*;
pub use crate::{redcap::redcap::import_response, structs::structs::*};
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

#[get("/api/v1/status")]
async fn greet() -> impl Responder {
    format!("The V1 API is live!")
}

#[get("/api/v1/study/{study_id}")]
async fn fetch_study(study_id: web::Path<String>) -> impl Responder {
    let mut study_id = study_id.into_inner();
    if study_id.ends_with(".json") {
        study_id = study_id.replace(".json", "");
    }

    let result = get_study(study_id);
    println!("Result: {:#?} ", result);
    result
}

#[get("/api/v1/studies")]
async fn all_studies() -> Result<HttpResponse, ApplicationError> {
    let studies = get_studies()?;
    let result = studies
        .iter()
        .filter_map(|study| to_string(study).ok())
        .collect::<String>();
    Ok(HttpResponse::Ok().body(result))
}

#[post("/api/v1/study")]
async fn create_study(study: web::Json<Study>) -> Result<HttpResponse, ApplicationError> {
    upload_study(study.0)?;
    Ok(HttpResponse::Ok().body("Study uploaded"))
}

#[post("/api/v1/response")]
async fn save_response(data: web::Form<Submission>) -> impl Responder {
    import_response(data.into_inner());
    "OK"
}

#[post("/api/v1/key")]
async fn save_key(data: web::Json<Key>) -> impl Responder {
    import_key(data.into_inner());
    "Success"
}

fn import_key(key: Key) {
    println!("{:?}", key);
}

pub fn init_api_keys() -> Vec<Key> {
    let mut file =
        std::fs::File::open("keys.json").expect("Unable to open keys.json. Does the file exist?");
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .expect("Unable to read keys.json. Is the file in the right format?");
    let keys: Vec<Key> = serde_json::from_str(&contents)
        .expect("Unable to parse keys.json. Is the file in the right format?");
    keys
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use actix_web::{
//         http::{self},
//         test,
//     };

//     #[actix_web::test]
//     async fn test_greet() {
//         let req = test::TestRequest::default().to_http_request();
//         let res = index().await();
//         assert_eq!(res.status(), http::StatusCode::OK);
//     }
// }
