#[macro_use]
pub extern crate rocket;

pub extern crate lazy_static;

use mongodb::options::ReplaceOptions;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    options::FindOneOptions,
};
use redcap::export_one_response;
use rocket::fairing::{Fairing, Info, Kind};
use rocket::fs::NamedFile;
use rocket::futures::stream::TryStreamExt;
use rocket::http::Header;
use rocket::Request;
use rocket::{form::Form, serde::json::Json};
use rocket_db_pools::{Connection, Database};
use serde::{Deserialize, Serialize};

use std::path::{Path, PathBuf};
use std::str::FromStr;

pub use redcap::Log;
pub use redcap::Response;
pub use study::Alert;
pub use study::Params;
pub use study::Study;

use crate::error::Error;
use crate::redcap::import_response;
use crate::users::User;

mod error;
mod redcap;
mod study;
mod users;

type Result<T> = std::result::Result<T, Error>;
type PotentialStudy = Result<Json<Study>>;

/// Automatic database connection using the connection string in Rocket.toml
///
/// https://rocket.rs/v0.5-rc/guide/state/#databases
#[derive(Database)]
#[database("mongodb")]
pub struct DB(mongodb::Client);

#[cfg(debug_assertions)]
pub const ACTIVE_DB: &str = "momenTUM-dev";

#[cfg(not(debug_assertions))]
pub const ACTIVE_DB: &str = "momenTUM";

#[derive(Debug, Serialize, Deserialize)]
pub struct Key {
    pub study_id: String,
    pub api_key: String,
}

#[get("/api/docs/<path..>")]
pub async fn docs_assets(path: PathBuf) -> Option<NamedFile> {
    let path = Path::new("/docs/").join(path);
    if path.is_file() {
        NamedFile::open(path).await.ok()
    } else {
        None
    }
}

#[get("/api/v1/status")]
pub fn status() -> &'static str {
    "The V1 API is live!"
}

#[get("/api/v1/studies/<study_id>")]
pub async fn fetch_study(db: Connection<DB>, mut study_id: String) -> PotentialStudy {
    if study_id.ends_with(".json") {
        study_id = study_id.replace(".json", "");
    }
    let filter = doc! { "$or": [ {"properties.study_id": &study_id}, {"_id": ObjectId::from_str(&study_id).unwrap_or_default()}]};
    let result = db
        .database(ACTIVE_DB)
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
pub async fn get_study_by_post(db: Connection<DB>, study_id: String) -> PotentialStudy {
    fetch_study(db, study_id).await
}

#[get("/api/v1/studies")]
pub async fn all_studies(db: Connection<DB>) -> Result<Json<Vec<Study>>> {
    let mut cursor = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .find(doc! {}, None)
        .await?;
    let mut studies = Vec::new();
    while cursor.advance().await? {
        if let Ok(study) = cursor.deserialize_current() {
            studies.push(study);
        }
    }
    Ok(Json(studies))
}

#[get("/api/v1/studies/all/<study_id>")]
pub async fn all_studies_of_study_id(
    db: Connection<DB>,
    study_id: String,
) -> Result<Json<Vec<Study>>> {
    let cursor = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .find(doc! {"properties.study_id": &study_id}, None)
        .await?;
    let studies = cursor.try_collect::<Vec<Study>>().await?;
    Ok(Json(studies))
}

#[post("/api/v1/study", data = "<potential_study>")]
pub async fn create_study(
    // user: Result<User>,
    db: Connection<DB>,
    potential_study: std::result::Result<Json<Study>, rocket::serde::json::Error<'_>>,
) -> Result<String> {
    // user?; // Tests if user authentication guard was successful.
    let mut study = potential_study.map_err(|e| error::Error::StudyParsing(e.to_string()))?;

    // Check if study ID already exists
    let existing_study = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .find_one(
            doc! { "properties.study_id": &study.properties.study_id },
            None,
        )
        .await?;

    if !study.properties.study_id.starts_with("test") && existing_study.is_some() {
        // Study ID already exists, return an error or handle it as desired
        return Err(error::Error::StudyExists(
            "Study already exists".to_string(),
        ));
    }

    study._id = Some(ObjectId::new());
    study.timestamp = Some(DateTime::now().timestamp_millis());
    let result = db
        .database(ACTIVE_DB)
        .collection::<Study>("studies")
        .insert_one(&*study, None)
        .await?;

    Ok(result.inserted_id.to_string())
}

/// Defining an API route for the app response submission
///
/// The route is defined as a POST request to /api/v1/response
/// Data contained in the request body is deserialized into a Response struct -> Verification is included
///
/// By including the Connection<DB> parameter, the database connection is automatically injected into the function
#[post("/api/v1/response", data = "<submission>")]
pub async fn save_response(submission: Form<Response>, db: Connection<DB>) -> Result<()> {
    import_response(db, submission.into_inner()).await
}

#[post("/api/v1/log", data = "<submission>")]
pub async fn save_log(submission: Form<Log>, db: Connection<DB>) -> Result<()> {
    db.database(ACTIVE_DB)
        .collection("logs")
        .insert_one(submission.into_inner(), None)
        .await?;

    Ok(())
}
#[get("/api/v1/response/<study_id>/<user_id>")]
pub async fn get_response(study_id: String, user_id: String, db: Connection<DB>) -> Result<String> {
    let response = export_one_response(db, study_id, user_id).await?;
    Ok(response)
}

#[post("/api/v1/redcap/<username>", data = "<study>")]
pub async fn create_redcap_project(
    db: Connection<DB>,
    study: Json<Study>,
    username: &str,
) -> Result<&'static str> {
    let study = study.0;
    let api_key = redcap::create_project(&study).await?;
    // println!("Created project with API key {}", api_key.clone());
    db.database(ACTIVE_DB)
        .collection::<Key>("keys")
        .replace_one(
            doc! {"study_id":&study.properties.study_id},
            Key {
                study_id: study.properties.study_id.clone(),
                api_key: api_key.clone(),
            },
            ReplaceOptions::builder().upsert(true).build(), // For true upsert, new key document will be inserted if not existing before => Only one key per study_id
        )
        .await?;
    redcap::import_metadata(&study, api_key.clone()).await?;
    redcap::enable_repeating_instruments(&study, api_key.clone()).await?;
    redcap::import_user(username, api_key.clone()).await?;

    Ok("Project successfully created. Go to https://tuspl22-redcap.srv.mwn.de/redcap/ to see it.")
}

#[post("/api/v1/user", data = "<new_user>")]
pub async fn add_user(
    new_user: Json<User>,
    user: Result<User>,
    db: Connection<DB>,
) -> Result<&'static str> {
    let is_admin_user = user?.email == "admin@tum.de";

    if is_admin_user {
        db.database(ACTIVE_DB)
            .collection::<User>("users")
            .insert_one(new_user.0, None)
            .await?;
        Ok("Inserted new user")
    } else {
        Err(Error::NotAdmin)
    }
}

#[catch(422)]
pub fn catch_malformed_request(req: &Request) -> String {
    format!("{req}")
}

/// Catches all OPTION requests in order to get the CORS related Fairing triggered.
// #[options("/<_..>")]
// pub fn all_options() {
//     /* Intentionally left empty */
// }

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(
        &self,
        _request: &'r Request<'_>,
        response: &mut rocket::Response<'r>,
    ) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

#[launch]
pub fn rocket() -> _ {
    dotenv::dotenv().ok();
    println!("The API is using the {ACTIVE_DB} database");

    std::env::var("REDCAP_SUPER_API_TOKEN")
        .expect("REDCAP_SUPER_API_TOKEN must be set for project creation");
    rocket::build()
        .register("/", catchers![catch_malformed_request])
        .attach(DB::init())
        .attach(CORS)
        .mount(
            "/",
            routes![
                status,
                get_study_by_post,
                create_study,
                fetch_study,
                all_studies,
                save_log,
                save_response,
                create_redcap_project,
                all_studies_of_study_id,
                add_user,
                docs_assets,
                get_response
            ],
        )
}
