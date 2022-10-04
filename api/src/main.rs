#[macro_use]
extern crate rocket;

use mongodb::options::ReplaceOptions;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    options::FindOneOptions,
};
use rocket::futures::stream::TryStreamExt;
use rocket::{form::Form, serde::json::Json};
use rocket_db_pools::{Connection, Database};
use serde::{Deserialize, Serialize};
use std::str::FromStr;
use study::Study;

use crate::error::Error;
use crate::redcap::redcap::{import_response, Log, Response};
use crate::users::User;

mod error;
mod redcap;
mod study;
mod users;

type Result<T> = std::result::Result<T, Error>;
type PotentialStudy = Result<Json<Study>>;

#[derive(Database)]
#[database("mongodb")]
pub struct DB(mongodb::Client);

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
async fn fetch_study(db: Connection<DB>, mut study_id: String) -> PotentialStudy {
    if study_id.ends_with(".json") {
        study_id = study_id.replace(".json", "");
    }
    let filter = doc! { "$or": [ {"properties.study_id": &study_id}, {"_id": ObjectId::from_str(&study_id).unwrap_or(ObjectId::new())}]};
    let result = db
        .database("momenTUM")
        .collection::<Study>("studies")
        .find_one(
            filter,
            FindOneOptions::builder()
                .sort(doc! { "timestamp": -1})
                .show_record_id(true)
                .build(),
        )
        .await?;
    match result {
        Some(study) => Ok(Json(study)),
        None => Err(Error::StudyNotFound),
    }
}

#[post("/api/v1/studies/<study_id>")] // Support for legacy schema app, which uses POST to retrieve studies
async fn get_study_by_post(db: Connection<DB>, study_id: String) -> PotentialStudy {
    fetch_study(db, study_id).await
}

#[get("/api/v1/studies")]
async fn all_studies(db: Connection<DB>) -> Result<Json<Vec<Study>>> {
    let cursor = db
        .database("momenTUM")
        .collection::<Study>("studies")
        .find(doc! {}, None)
        .await?;
    let studies = cursor.try_collect::<Vec<Study>>().await?;
    Ok(Json(studies))
}

#[get("/api/v1/studies/all/<study_id>")]
async fn all_studies_of_study_id(db: Connection<DB>, study_id: String) -> Result<Json<Vec<Study>>> {
    let cursor = db
        .database("momenTUM")
        .collection::<Study>("studies")
        .find(doc! {"properties.study_id": &study_id}, None)
        .await?;
    let studies = cursor.try_collect::<Vec<Study>>().await?;
    Ok(Json(studies))
}

#[post("/api/v1/study", data = "<study>")]
async fn create_study(
    user: Result<User>, // Implicit Result to return precise error message instead of catcher route: https://api.rocket.rs/v0.5-rc/rocket/request/trait.FromRequest.html#outcomes
    db: Connection<DB>,
    mut study: Json<Study>,
) -> Result<String> {
    user?; // Tests if user authentication guard was successful.
    study._id = Some(ObjectId::new());
    study.timestamp = Some(DateTime::now().timestamp_millis());
    let result = db
        .database("momenTUM")
        .collection::<Study>("studies")
        .insert_one(&*study, None)
        .await?;

    Ok(result.inserted_id.to_string())
}

#[post("/api/v1/response", data = "<submission>")]
async fn save_response(submission: Form<Response>, db: Connection<DB>) -> Result<()> {
    import_response(db, submission.into_inner()).await
}

#[post("/api/v1/log", data = "<submission>")]
async fn save_log(submission: Form<Log>, db: Connection<DB>) -> Result<()> {
    db.database("momenTUM")
        .collection("logs")
        .insert_one(submission.into_inner(), None)
        .await?;

    return Ok(());
}

#[post("/api/v1/key", data = "<key>")]
async fn save_key(key: Json<Key>, db: Connection<DB>) -> Result<()> {
    db.database("momenTUM")
        .collection::<Key>("keys")
        .replace_one(
            doc! {"study_id":&key.study_id},
            &*key,
            ReplaceOptions::builder().upsert(true).build(), // For true upsert, new key document will be inserted if not existing before => Only one key per study_id
        )
        .await?;

    Ok(())
}

#[launch]
fn rocket() -> _ {
    rocket::build().attach(DB::init()).mount(
        "/",
        routes![
            status,
            get_study_by_post,
            create_study,
            fetch_study,
            all_studies,
            save_log,
            save_key,
            save_response,
            all_studies_of_study_id,
        ],
    )
}
