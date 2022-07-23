pub mod studies {
    use crate::structs::structs::*;
    use std::fs;
    use std::process::Command;

    pub fn init_study_repository() -> () {
        if fs::metadata("studies").is_ok() {
            // git fetch
            Command::new("git")
                .args(["-C", "studies", "pull"])
                .output()
                .expect("Something went wrong when fetching the studies repo");
            println!("Downloaded lastest studies from GitHub")
        } else {
            Command::new("git")
                .args(["clone", "git@github.com:TUMChronobiology/studies.git"])
                .output()
                .expect("Something went wrong when cloning the studies repo");
            println!("Cloned studies from GitHub")
        }
    }

    pub fn to_string(study: &Study) -> Result<String, ApplicationError> {
        match serde_json::to_string(study) {
            Ok(result) => Ok(result),

            _ => Err(ApplicationError::StudyNotConvertible),
        }
    }

    fn to_study(json: String) -> Result<Study, ApplicationError> {
        let study = serde_json::from_str(&json);
        match study {
            Ok(result) => Ok(result),

            Err(error) => {
                println!("{:?}", error);
                Err(ApplicationError::StudyInvalid)
            }
            _ => Err(ApplicationError::StudyInvalid),
        }
    }

    pub fn get_study(study_id: String) -> Result<Study, ApplicationError> {
        println!("Retrieving study {}", study_id);
        let study_path = format!("studies/{}.json", study_id);
        let study_file = fs::read_to_string(study_path)?;
        let study = to_study(study_file)?;

        Ok(study)
    }

    pub fn get_studies() -> Result<Vec<Study>, ApplicationError> {
        let mut studies = Vec::new();
        println!("Retrieving studies");
        let studies_path = "studies";
        let studies_files = fs::read_dir(studies_path)?;
        for study_file in studies_files {
            if let Ok(study_file) = study_file {
                let study_path = study_file.path();
                let study_file = fs::read_to_string(study_path)?;
                let study = serde_json::from_str(&study_file)?;
                studies.push(study);
            }
        }
        Ok(studies)
    }

    pub fn generate_dictionary(study_id: String) -> Result<String, ApplicationError> {
        println!("Generation dictionary for {}", study_id);
        let study = get_study(study_id)?;

        let mut result = String::from("Variable / Field Name','Form Name','Section Header','Field Type','Field Label','Choices, Calculations, OR Slider Labels','Field Note','Text Validation Type OR Show Slider Number','Text Validation Min','Text Validation Max',Identifier?,'Branching Logic (Show field only if...)','Required Field?','Custom Alignment','Question Number (surveys only)','Matrix Group Name','Matrix Ranking?','Field Annotation'\n");
        for module in study.modules {
            for section in module.sections {
                for question in section.questions {
                    // if question.type == "instruction" {
                    //     continue;
                    // }
                    result.push_str(
                        "{question.id}, {module.uuid},,text,{question.text},,,,,,,,,,,,,\n",
                    )
                }
            }
        }
        Ok(result)
    }

    pub fn upload_study(study: Study) -> Result<(), ApplicationError> {
        let contents = to_string(&study)?;

        let result = fs::write(
            format!("studies/{}.json", &study.properties.study_id),
            contents,
        );
        match result {
            Ok(_) => {
                let result = Command::new("git")
                    .args([
                        "-C",
                        "studies",
                        "add",
                        format!("{}.json", study.properties.study_id).as_str(),
                    ])
                    .output();
                match result {
                    Ok(_) => {
                        // git commit
                        let result = Command::new("git")
                            .args(["-C", "studies", "commit", "-m", "Uploaded study"])
                            .output();
                        match result {
                            Ok(_) => {
                                // git push
                                let result =
                                    Command::new("git").args(["-C", "studies", "push"]).output();
                                match result {
                                    Ok(_) => Ok(()),
                                    Err(error) => {
                                        println!("{:?}", error);
                                        Err(ApplicationError::PushError)
                                    }

                                    _ => Err(ApplicationError::PushError),
                                }
                            }
                            Err(e) => {
                                println!("{:?}", e);
                                Err(ApplicationError::CommitError)
                            }
                            _ => Err(ApplicationError::CommitError),
                        }
                    }

                    Err(e) => {
                        println!("{:?}", e);
                        Err(ApplicationError::AddError)
                    }
                    _ => Err(ApplicationError::AddError),
                }
            }
            _ => Err(ApplicationError::StudyNotSaved),
        }
    }
}
