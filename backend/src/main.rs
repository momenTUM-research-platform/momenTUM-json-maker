#[macro_use]
extern crate rocket;

use mongodb::options::ReplaceOptions;
use mongodb::{bson::doc, options::FindOneOptions};
use rocket::{form::Form, serde::json::Json};
use rocket_db_pools::{Connection, Database};
use serde::{Deserialize, Serialize};
use study::Study;

use crate::error::Error;
use crate::redcap::redcap::{import_response, Submission};

mod error;
mod redcap;
mod study;

#[derive(Database)]
#[database("mongodb")]
pub struct DB(mongodb::Client);
type Result<T> = std::result::Result<T, Error>;
type PotentialStudy = Result<Json<Study>>;

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
async fn fetch_study(db: Connection<DB>, study_id: &str) -> PotentialStudy {
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
        .await?;

    match result {
        Some(study) => Ok(Json(study)),
        None => Err(Error::StudyNotFound),
    }
}

#[post("/api/v1/studies/<study_id>")] // Support for legacy schema app, which uses POST to retrieve studies
async fn get_study_by_post(db: Connection<DB>, study_id: &str) -> PotentialStudy {
    fetch_study(db, study_id).await
}

#[get("/api/v1/studies")]
async fn all_studies(db: Connection<DB>) -> Result<Json<Vec<Study>>> {
    let studies = db
        .database("momentum")
        .collection::<Study>("studies")
        .find(doc! {}, None)
        .await;

    todo!()
    // match studies {
    //     Ok(study) => Ok(Json(study.collect::<Vec<Study>>())),
    //     Ok(None) => (Err(Error::StudyNotFound)),
    //     Err(err) => Err(Error::DbError(err)),
    // }
}

#[post("/api/v1/study", data = "<study>")]
async fn create_study(db: Connection<DB>, study: Json<Study>) -> Result<String> {
    let result = db
        .database("momentum")
        .collection::<Study>("studies")
        .insert_one(&*study, None)
        .await?;

    Ok(result.inserted_id.to_string())
}

#[post("/api/v1/response", data = "<data>")]
async fn save_response(data: Form<Submission>, db: Connection<DB>) -> Result<()> {
    println!("Saving response for {}", data.study_id);
    import_response(db, data).await
}
#[post("/api/v1/key", data = "<key>")]
async fn save_key(key: Json<Key>, db: Connection<DB>) -> Result<()> {
    db.database("momentum")
        .collection::<Key>("keys")
        .replace_one(
            doc! {"study_id":&key.study_id},
            &*key,
            ReplaceOptions::builder().upsert(true).build(), // For true upsert, new key document will be inserted if not existing before => Only one key per study_id
        )
        .await?;

    Ok(())
}
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
    rocket::build().attach(DB::init()).mount(
        "/",
        routes![
            status,
            get_study_by_post,
            create_study,
            fetch_study,
            all_studies,
            save_key,
            save_response
        ],
    )
}
