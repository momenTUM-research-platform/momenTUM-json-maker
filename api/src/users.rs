use crate::{Error, DB};
use base64::encode;
use mongodb::bson::doc;
use rocket::{
    request::{FromRequest, Outcome},
    Request,
};
use rocket_db_pools::Connection;
use serde::Deserialize;
use sha2::Digest;
#[derive(Deserialize, Debug)]
pub struct User {
    email: String,
    password_hash: String,
}
#[rocket::async_trait]
impl<'r> FromRequest<'r> for User {
    type Error = Error;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        // Auth header: Basic <base64 string of email:password>
        let auth_header = request.headers().get_one("Authorization");

        if let None = auth_header {
            return Outcome::Failure((
                rocket::http::Status::BadRequest,
                Error::AuthMalformed(String::from("No auth header")),
            ));
        }

        let auth_header = auth_header.unwrap().split_once(" ");

        if auth_header.is_none() || auth_header.unwrap().1.is_empty() {
            return Outcome::Failure((
                rocket::http::Status::BadRequest,
                Error::AuthMalformed(String::from("No auth string")),
            ));
        }

        let decoded_auth = base64::decode(auth_header.unwrap().1);

        if let Err(err) = decoded_auth {
            println!("{}", err);
            return Outcome::Failure((
                rocket::http::Status::BadRequest,
                Error::AuthMalformed(err.to_string()),
            ));
        }

        let decoded_as_string = String::from_utf8(decoded_auth.unwrap()).unwrap();
        let mut split = decoded_as_string.split(":");

        let email = split.next();
        let password = split.next();

        if email.is_none() {
            return Outcome::Failure((rocket::http::Status::BadRequest, Error::AuthNoEmail));
        }
        if password.is_none() {
            return Outcome::Failure((rocket::http::Status::BadRequest, Error::AuthNoPassword));
        }

        let mut hasher = sha2::Sha256::new();

        hasher.update(String::from("VERY_STRONG_SALT") + password.unwrap());
        let password_hash = hasher.finalize();
        let password_hash = encode(&password_hash);

        let db = request.guard::<Connection<DB>>().await.succeeded();

        if db.is_none() {
            return Outcome::Failure((
                rocket::http::Status::BadRequest,
                Error::AuthMalformed(String::from("Could not connect to Database")),
            ));
        }

        let result = db
            .unwrap()
            .database("momenTUM")
            .collection::<User>("users")
            .find_one(
                doc! { "email":email.unwrap(), "password_hash": password_hash },
                None,
            )
            .await;

        match result {
            Ok(Some(user)) => Outcome::Success(user),
            _ => Outcome::Failure((rocket::http::Status::BadRequest, Error::AuthIncorrect)),
        }
    }
}
