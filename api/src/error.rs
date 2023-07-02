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

    #[error("Authorization header is malformed. Please provide it in the following form: `email:password` base64 encoded. \n Error: {0} ")]
    AuthMalformed(String),
    #[error("No email provided")]
    AuthNoEmail,

    #[error("No password provided")]
    AuthNoPassword,

    #[error("Email or password incorrect")]
    AuthIncorrect,

    #[error("You are not an admin user")]
    NotAdmin,

    #[error("No corresponding API key for redcap project found")]
    NoCorrespondingAPIKey,

    #[error("Redcap authentication error. Is the API key correct?")]
    RedcapAuthenication,

    #[error("{0}")]
    Redcap(String),

    #[error("Database Error")]
    DB(#[from] mongodb::error::Error),

    #[error("Request error")]
    Request(#[from] reqwest::Error),
    #[error("Response deserialization error")]
    ResponseDeserialization(#[from] serde_json::Error),

    #[error("Study parsing error: {0}")]
    StudyParsing(String),

    #[error("Study already exists")]
    StudyExists(String),

    #[error("Record not found in the database")]
    RecordNotFoundInDB,

    #[error("Invalid response data")]
    InvalidResponseData,
}

impl<'r> Responder<'r, 'static> for Error {
    fn respond_to(self, req: &'r Request<'_>) -> response::Result<'static> {
        println!("Returning error: {self}");
        match self {
            Error::StudyNotFound => response::status::NotFound(self.to_string()).respond_to(req),
            Error::AuthMalformed(_) => {
                response::status::BadRequest(Some(self.to_string())).respond_to(req)
            }
            Error::AuthNoEmail => {
                response::status::BadRequest(Some(self.to_string())).respond_to(req)
            }
            Error::AuthNoPassword => {
                response::status::BadRequest(Some(self.to_string())).respond_to(req)
            }
            Error::AuthIncorrect => {
                response::status::Unauthorized(Some(self.to_string())).respond_to(req)
            }
            Error::NotAdmin => {
                response::status::Unauthorized(Some(self.to_string())).respond_to(req)
            }

            Error::NoCorrespondingAPIKey => {
                response::status::Unauthorized(Some(self.to_string())).respond_to(req)
            }
            Error::RedcapAuthenication => {
                response::status::Unauthorized(Some(self.to_string())).respond_to(req)
            }
            Error::Redcap(err) => response::status::Custom(Status::BadRequest, err).respond_to(req),
            Error::ResponseDeserialization(err) => {
                response::status::Custom(Status::BadRequest, err.to_string()).respond_to(req)
            }
            Error::DB(err) => {
                response::status::Custom(Status::InternalServerError, err.to_string())
                    .respond_to(req)
            }
            Error::Request(err) => {
                response::status::Custom(Status::InternalServerError, err.to_string())
                    .respond_to(req)
            }

            Error::StudyExists(err) => response::status::Custom(Status::BadRequest, err).respond_to(req),
            Error::RecordNotFoundInDB => response::status::NotFound(self.to_string()).respond_to(req),
            Error::InvalidResponseData => response::status::BadRequest(Some(self.to_string())).respond_to(req),
            Error::StudyParsing(err) => response::status::BadRequest(Some(err)).respond_to(req), // Error::RocketError(err) => {
                                                                                                 //     response::status::Custom(Status::InternalServerError, err.to_string())
                                                                                                 //         .respond_to(req)
                                                                                                 // }
        }
    }
}
