use thiserror::Error;

#[derive(Debug, Error, Responder)]
pub enum Error {
    #[response(status = 404)]
    #[error("Study not found")]
    StudyNotFound(String),
    #[response(status = 400)]
    #[error("Study invalid: {0}")]
    StudyInvalid(String),
    #[response(status = 401)]
    #[error("No corresponding API key for redcap project found")]
    NoCorrespondingAPIKey(String),
    #[response(status = 401)]
    #[error("Redcap authentication error. Is the API key correct?")]
    RedcapAuthenicationError(String),
    #[response(status = 400)]
    #[error("No entries or responses found. Must contain any of the two.")]
    NoEntriesOrResponses(String),
    #[response(status = 500)]
    #[error("{0}")]
    RedcapError(String),
    #[response(status = 500)]
    #[error("Database Error")]
    DbError(#[from] mongodb::error::Error),
    #[response(status = 500)]
    #[error("Request error")]
    RequestError(#[from] reqwest::Error),
}
