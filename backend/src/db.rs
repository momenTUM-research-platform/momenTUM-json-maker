use std::fs;



use crate::{
    error::Error,
    generate_metadata,
    git::git::{add_study, commit_study, push_study},
    redcap::redcap::{Log, Response},
    study::{Metadata, Study},
    Result,
};
#[derive(Debug)]
pub struct DB {
    client: Client,
    momentum: Database,
    logs: Collection<Log>,
    studies: Collection<Study>,
    responses: Collection<Response>,
}

impl Client {
    async fn insert_log(&self, log: Log) -> Result<InsertOneResult> {
        let result = self
            .database("momentum")
            .collection("logs")
            .insert_one(log, None)
            .await?;
        Ok(result)
    }
}

impl DB {
    async fn init(uri: &str) -> Result<Self> {
        // Get a handle to the cluster
        let client = Client::with_uri_str(uri).await?;
        let momentum = client.database("momentum");
        momentum.run_command(doc! {"ping": 1}, None).await?;
        println!("Connected successfully.");

        let logs = momentum.collection("logs");
        let studies = momentum.collection("studies");
        let responses = momentum.collection("responses");

        let db = DB {
            client,
            momentum,
            logs,
            studies,
            responses,
        };

        Ok(db)
    }

    async fn insert_study(&self, study: Study) -> Result<InsertOneResult> {
        fs::write(
            format!("studies/{}.json", study.properties.study_id),
            study.to_string(),
        )?;
        add_study(&study.properties.study_id)?;
        let commit = commit_study(&study.properties.study_id)?;
        push_study()?;
        study.metadata = Some(Metadata {
            commit,
            timestamp: chrono::Utc::now().timestamp_millis(),
        });

        let result = self.studies.insert_one(study, None).await?;
        Ok(result)
    }

    async fn insert_log(&self, log: Log) -> Result<InsertOneResult> {
        let result = self.logs.insert_one(log, None).await?;
        Ok(result)
    }
    async fn insert_response(&self, response: Response) -> Result<InsertOneResult> {
        let result = self.responses.insert_one(response, None).await?;
        Ok(result)
    }

    async fn get_study(&self, study_id: &str, commit_id: Option<&str>) -> Result<Study> {
        let filter = if commit_id.is_some() {
            doc! { "properties": { "study_id": study_id}, "metadata": {"commit" : commit_id}}
        } else {
            doc! { "properties": { "study_id": study_id}}
        };
        let result = self.studies.find_one(filter, None).await?;

        result.ok_or(Error::StudyNotFound)
    }
}
