mod git;
mod redcap;
mod structs;
mod studies;
use std::io::Read;

pub use crate::{
    git::git::init_study_repository,
    redcap::redcap::{import_response, Submission},
    structs::structs::*,
    studies::studies::*,
};
use actix_multipart_extract::Multipart;
use actix_web::{get, post, route, web, HttpResponse, Responder};
use std::fs;

#[get("/api/v1/status")]
async fn greet() -> impl Responder {
    format!("The V1 API is live!")
}

#[route("/api/v1/study/{study_id}", method = "GET", method = "POST")]
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
    Ok(HttpResponse::Ok().json(studies))
}

#[post("/api/v1/study")]
async fn create_study(study: web::Json<Study>) -> Result<HttpResponse, ApplicationError> {
    upload_study(study.0)?;
    Ok(HttpResponse::Ok().body("study uploaded"))
}

// #[post("/api/v1/response")]
// async fn save_response(data: web::Form<Submission>, keys: web::Data<AppState>) -> impl Responder {
//     match import_response(data.0, keys.keys.lock().unwrap().clone()).await {
//         Ok(_) => HttpResponse::Ok().body("Response saved"),
//         Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//     }
// }

#[post("/api/v1/response")]
async fn save_response(data: Multipart<Submission>, keys: web::Data<AppState>) -> impl Responder {
    println!("{:#?}", data.study_id);
    match import_response(data, keys.keys.lock().unwrap().clone()).await {
        Ok(_) => HttpResponse::Ok().body("Response saved"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[post("/api/v1/key")]
async fn save_key(
    key: web::Json<Key>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, ApplicationError> {
    let api_key = key.0.api_key.clone();
    let study_id = key.0.study_id.clone();
    data.keys.lock().unwrap().push(key.0);
    println!("{:#?}", data.keys.lock().unwrap());
    let file = fs::read_to_string("keys.json")?;
    let mut json: Vec<Key> = serde_json::from_str(&file)?;
    json.push(Key { study_id, api_key });
    fs::write("keys.json", serde_json::to_string_pretty(&json)?)?;
    Ok(HttpResponse::Ok().body("Key saved"))
}
pub async fn missing_route() -> impl Responder {
    HttpResponse::NotFound().body(
        "There is nothing here.

Available Routes: 
    /api/v1/status
    /api/v1/study/{study_id}
    /api/v1/studies
    /api/v1/response
    /api/v1/key
    ",
    )
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
