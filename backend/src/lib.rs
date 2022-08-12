mod git;
mod redcap;
mod structs;
mod studies;
use std::io::Read;

pub use crate::{
    git::git::{generate_metadata, init_study_repository, timestamp},
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

#[get("/api/v1/study/{study_id}/{commit}")]
async fn fetch_study_by_commit(params: web::Path<(String, String)>) -> impl Responder {
    let (mut study_id, commit) = params.into_inner();
    if study_id.ends_with(".json") {
        study_id = study_id.replace(".json", "");
    }
    let result = get_study_by_commit(&study_id, &commit);
    println!("Retrieved study: {study_id} at commit {commit}");
    result
}

#[route("/api/v1/study/{study_id}", method = "GET", method = "POST")]
async fn fetch_study(study_id: web::Path<String>) -> impl Responder {
    let mut study_id = study_id.into_inner();
    if study_id.ends_with(".json") {
        study_id = study_id.replace(".json", "");
    }

    let result = get_study(&study_id);
    println!("Retrieved study: {}", study_id);
    result
}

#[get("/api/v1/studies")]
async fn all_studies() -> Result<HttpResponse, ApplicationError> {
    let studies = get_studies()?;
    Ok(HttpResponse::Ok().json(studies))
}

#[post("/api/v1/study")]
async fn create_study(study: web::Json<Study>) -> impl Responder {
    upload_study(study.0)
}

#[post("/api/v1/response")]
async fn save_response(data: Multipart<Submission>, keys: web::Data<AppState>) -> impl Responder {
    println!("Saving response for {}", data.study_id);
    match import_response(data, keys.keys.lock().unwrap().clone()).await {
        Ok(_) => HttpResponse::Ok().body("Response saved"),
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}
// TODO rewrite to hashmap
#[post("/api/v1/key")]
async fn save_key(
    key: web::Json<Key>,
    data: web::Data<AppState>,
) -> Result<HttpResponse, ApplicationError> {
    let api_key = key.0.api_key.clone();
    let study_id = key.0.study_id.clone();
    data.keys.lock().unwrap().push(key.0);
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
