use rocket::{
    http::Status,
    response::{self, Responder},
    Request,
};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Study not found")]
    StudyNotFound,

    #[error("No corresponding API key for redcap project found. Please add one through the POST /api/v1/key route")]
    NoCorrespondingAPIKey,

    #[error("Redcap authentication error. Is the API key correct?")]
    RedcapAuthenicationError,

    #[error("{0}")]
    RedcapError(String),

    #[error("Database Error")]
    DbError(#[from] mongodb::error::Error),

    #[error("Request error")]
    RequestError(#[from] reqwest::Error),
    #[error("Response deserialization error")]
    ResponseDeserializationError(#[from] serde_json::Error),
}

impl<'r> Responder<'r, 'static> for Error {
    fn respond_to(self, req: &'r Request<'_>) -> response::Result<'static> {
        match self {
            Error::StudyNotFound => response::status::NotFound(self.to_string()).respond_to(req),
            Error::NoCorrespondingAPIKey => {
                response::status::Unauthorized(Some(self.to_string())).respond_to(req)
            }
            Error::RedcapAuthenicationError => {
                response::status::Unauthorized(Some(self.to_string())).respond_to(req)
            }
            Error::RedcapError(err) => {
                response::status::Custom(Status::BadRequest, err).respond_to(req)
            }
            Error::ResponseDeserializationError(err) => {
                response::status::Custom(Status::BadRequest, err.to_string()).respond_to(req)
            }
            Error::DbError(err) => {
                response::status::Custom(Status::InternalServerError, err.to_string())
                    .respond_to(req)
            }
            Error::RequestError(err) => {
                response::status::Custom(Status::InternalServerError, err.to_string())
                    .respond_to(req)
            }
        }
    }
}
