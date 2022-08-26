pub mod studies {
    use crate::git::git::*;
    use crate::structs::structs::*;
    use std::collections::HashMap;
    use std::fs;
    use std::sync::MutexGuard;

    pub fn to_string(study: &Study) -> Result<String, ApplicationError> {
        match serde_json::to_string(study) {
            Ok(result) => Ok(result),
            _ => Err(ApplicationError::StudyNotConvertible),
        }
    }

    fn to_study(json: String) -> Result<Study, ApplicationError> {
        let study = serde_json::from_str(&json)?;
        Ok(study)
    }

    pub fn get_study(
        studies: HashMap<String, Study>,
        study_id: String,
        commit: Option<String>,
    ) -> Result<Study, ApplicationError> {
        let mut commit = commit.unwrap_or("".to_string());
        if commit.len() > 6 {
            commit = commit[..6].to_string();
        }
        let key = study_id + ":" + &commit;
        println!("Fetching study {}", key);
        let study = studies.get(&key);

        match study {
            Some(study) => Ok(study.clone()),
            _ => Err(ApplicationError::StudyNotFound),
        }
    }

    pub fn get_study_from_file(
        study_id: &String,
        commit: Option<&String>,
    ) -> Result<Study, ApplicationError> {
        checkout(commit)?;
        let study_path = format!("studies/{}.json", study_id);
        let study_file = fs::read_to_string(study_path)?;
        let mut study = to_study(study_file)?;
        study.metadata = Some(generate_metadata(&study_id)?);
        checkout(Some(&"main".to_string()))?;
        Ok(study)
    }

    pub fn upload_study(
        mut studies: MutexGuard<HashMap<String, Study>>,
        mut study: Study,
    ) -> Result<(), ApplicationError> {
        println!("Uploading study {}", &study.properties.study_id);
        let study_id = &study.properties.study_id;
        let contents = to_string(&study)?;

        let result = fs::write(format!("studies/{}.json", study_id), contents);
        match result {
            Ok(_) => {
                add_study(study_id)?;
                commit_study(study_id)?;
                let metadata = generate_metadata(study_id)?;
                study.metadata = Some(metadata);
                studies.insert(
                    study.properties.study_id.to_string()
                        + ":"
                        + &study.metadata.as_ref().unwrap().commits[0].id[..6],
                    study.clone(),
                );
                studies.insert(
                    study.properties.study_id.to_string() + ":" + "LATEST",
                    study,
                );
                push_study()?;

                Ok(())
            }
            _ => Err(ApplicationError::StudyNotSaved),
        }
    }
}
