use rocket::{
    http::Status,
    response::{self, Responder, Result},
    Request, Response,
};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Study not found")]
    StudyNotFound,

    // #[error("Study invalid: {0}")]
    // StudyInvalid(String),
    #[error("No corresponding API key for redcap project found")]
    NoCorrespondingAPIKey,

    #[error("Redcap authentication error. Is the API key correct?")]
    RedcapAuthenicationError,

    #[error("{0}")]
    RedcapError(String),

    #[error("No entries or responses found. Must contain any of the two.")] // get rid of this
    NoEntriesOrResponses,

    #[error("Database Error")]
    DbError(#[from] mongodb::error::Error),

    #[error("Request error")]
    RequestError(#[from] reqwest::Error),
}

impl<'r> Responder<'r, 'static> for Error {
    fn respond_to(self, req: &'r Request<'_>) -> response::Result<'static> {
        match self {
            Error::StudyNotFound =>response::status::NotFound("No study with this study_id available").respond_to(req),
            Error::NoCorrespondingAPIKey => response::status::Unauthorized(Some("No corresponding API key for redcap project found. Please supply one through POST /api/v1/key")).respond_to(req),
            Error::RedcapAuthenicationError =>response::status::Unauthorized(Some("The corresponding API key did not work. Please supply a new one through POST /api/v1/key")).respond_to(req),
            Error::RedcapError(err) => response::status::Custom(Status::InternalServerError, err).respond_to(req),
            Error::DbError(err) => response::status::Custom(Status::InternalServerError, err.to_string()).respond_to(req),
            Error::RequestError(err) => response::status::Custom(Status::InternalServerError, err.to_string()).respond_to(req),


            _ => response::status::Custom(Status::InternalServerError, "We really have no idea what went wrong. Please report this to Constantin Goeldel").respond_to(req)
        }
    }
}
