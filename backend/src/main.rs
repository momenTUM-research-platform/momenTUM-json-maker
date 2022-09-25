#[macro_use]
extern crate rocket;
use mongodb::{bson::doc, options::FindOneOptions};
use rocket::{http::Status, response::Responder, serde::json::Json};
use rocket_db_pools::{Connection, Database};
use serde::{Deserialize, Serialize};
use study::Study;

use crate::error::Error;

mod error;
mod redcap;
mod study;

#[derive(Database)]
#[database("mongodb")]
struct Mongo(mongodb::Client);

type PotentialStudy = Json<Option<Study>>;
#[derive(Debug, Serialize, Deserialize)]
pub struct Key {
    pub study_id: String,
    pub api_key: String,
}

#[get("/api/v1/status")]
fn status() -> &'static str {
    "The V1 API is live!"
}

#[get("/api/v1/studies/<study_id>")]
async fn fetch_study(db: Connection<Mongo>, study_id: &str) -> Result<Json<Study>, Error> {
    if study_id.ends_with(".json") {
        let study_id = study_id.replace(".json", "");
    }
    let filter = doc! { "$or": [ {"properties": { "study_id": &study_id}}, {"_id": &study_id}]};
    let result = db
        .database("momentum")
        .collection::<Study>("studies")
        .find_one(
            filter,
            FindOneOptions::builder().sort(doc! { "_id": -1}).build(),
        )
        .await;

    match result {
        Ok(Some(study)) => Ok(Json(study)),
        Ok(None) => Err(Error::StudyNotFound),
        Err(err) => Err(Error::DbError(err)),
    }
}

#[post("/api/v1/studies/<study_id>")] // Support for legacy schema app, which uses POST to retrieve studies
async fn get_study_by_post(db: Connection<Mongo>, study_id: &str) -> PotentialStudy {
    fetch_study(db, study_id).await
}

#[get("/api/v1/studies")]
async fn all_studies(db: Connection<Mongo>) -> Json<Vec<Study>> {
    let studies = db
        .database("momentum")
        .collection::<Study>("studies")
        .find(doc! {}, None);
    studies
}

#[post("/api/v1/study", data = "<study>")]
async fn create_study(mut db: Connection<Mongo>, study: Json<Study>) {
    let result = db
        .database("momentum")
        .collection::<Study>("studies")
        .insert_one(study, None);
    result._id
}

// #[post("/api/v1/response")]
// async fn save_response(data: Multipart<Submission>, state: web::Data<State>) -> impl Responder {
//     println!("Saving response for {}", data.study_id);
//     match import_response(data, state).await {
//         Ok(_) => HttpResponse::Ok().body("Response saved"),
//         Err(e) => HttpResponse::BadRequest().body(e.to_string()),
//     }
// }
// #[post("/api/v1/key")]
// async fn save_key(key: web::Json<Key>, data: web::Data<State>) -> Result<HttpResponse> {
//     let api_key = key.0.api_key.clone();
//     let study_id = key.0.study_id.clone();
//     let mut keys = data.keys.lock().unwrap();
//     keys.insert(study_id, api_key);

//     fs::write("keys.json", serde_json::to_string_pretty(&keys.clone())?)?;
//     Ok(HttpResponse::Ok().body("Key saved"))
// }
#[catch(404)]
pub async fn missing_route() -> &'static str {
    "There is nothing here.

Available Routes: 
/api/v1/status
    /api/v1/studies/{study_id}/{commit_id}
    /api/v1/studies/{study_id}
    /api/v1/studies
    /api/v1/response
    /api/v1/key
    "
}

#[launch]
fn rocket() -> _ {
    rocket::build().attach(Mongo::init()).mount(
        "/",
        routes![
            status,
            fetch_latest_study_of_study_id,
            get_study_by_post,
            missing_route,
            create_study,
            fetch_study,
            all_studies
        ],
    )
}
