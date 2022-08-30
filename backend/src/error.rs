use actix_web::{HttpResponse, ResponseError};
use std::io;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Error when using git: {0}")]
    GitError(String),
    #[error("Study not found")]
    StudyNotFound,
    #[error("Study invalid: {0}")]
    StudyInvalid(String),
    #[error("Error when generating metadata")]
    GenerateMetadataError,

    #[error("No corresponding API key for redcap project found")]
    NoCorrespondingAPIKey,
    #[error("No entries or responses found. Must contain any of the two.")]
    NoEntriesOrResponses,
    #[error("Redcap authentication error. Is the API key correct?")]
    RedcapAuthenicationError,
    #[error("{0}")]
    RedcapError(String),
    #[error("Database Error")]
    DbError(#[from] mongodb::error::Error),
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::BadRequest().body(format!("Error while handling the request: {}", self))
    }
}
