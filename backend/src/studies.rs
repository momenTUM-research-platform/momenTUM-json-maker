pub mod studies {
    use crate::git::git::*;
    use crate::structs::structs::*;
    use std::fs;

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

    pub fn get_study(study_id: &String) -> Result<Study, ApplicationError> {
        println!("Retrieving study {}", study_id);
        let study_path = format!("studies/{}.json", study_id);
        let study_file = fs::read_to_string(study_path)?;
        let mut study = to_study(study_file)?;
        study.metadata = Some(generate_metadata(&study_id)?);
        Ok(study)
    }

    pub fn get_study_by_commit(
        study_id: &String,
        commit: &String,
    ) -> Result<Study, ApplicationError> {
        checkout(commit)?;
        println!("Retrieving study {}", study_id);
        let study_path = format!("studies/{}.json", study_id);
        let study_file = fs::read_to_string(study_path)?;
        let mut study = to_study(study_file)?;
        study.metadata = Some(generate_metadata(&study_id)?);
        checkout(&"main".to_string())?;
        Ok(study)
    }

    pub fn get_studies() -> Result<Vec<Study>, ApplicationError> {
        println!("Retrieving studies");
        let studies_path = "studies";
        let study_files = fs::read_dir(studies_path)?;
        let studies = study_files
            .into_iter()
            .filter_map(|study_file| study_file.ok())
            .map(|study_file| fs::read_to_string(study_file.path()))
            .filter_map(|study| study.ok())
            .map(|study| to_study(study))
            .filter_map(|study| study.ok())
            .collect::<Vec<Study>>();

        Ok(studies)
    }

    // pub fn generate_dictionary(study_id: String) -> Result<String, ApplicationError> {
    //     println!("Generation dictionary for {}", study_id);
    //     let study = get_study(study_id)?;

    //     let mut result = String::from("Variable / Field Name','Form Name','Section Header','Field Type','Field Label','Choices, Calculations, OR Slider Labels','Field Note','Text Validation Type OR Show Slider Number','Text Validation Min','Text Validation Max',Identifier?,'Branching Logic (Show field only if...)','Required Field?','Custom Alignment','Question Number (surveys only)','Matrix Group Name','Matrix Ranking?','Field Annotation'\n");
    //     for module in study.modules {
    //         for section in module.sections {
    //             for question in section.questions {
    //                 // if question.type == "instruction" {
    //                 //     continue;
    //                 // }
    //                 result.push_str(
    //                     format!(
    //                         "{}, {},,text,{},,,,,,,,,,,,,\n",
    //                         question.id, module.uuid, question.text,
    //                     )
    //                     .as_str(),
    //                 )
    //             }
    //         }
    //     }
    //     Ok(result)
    // }

    pub fn upload_study(study: Study) -> Result<Metadata, ApplicationError> {
        println!("Uploading study {}", &study.properties.study_id);
        let study_id = &study.properties.study_id;
        let contents = to_string(&study)?;

        let result = fs::write(format!("studies/{}.json", study_id), contents);
        match result {
            Ok(_) => {
                add_study(study_id)?;
                commit_study(study_id)?;
                push_study()?;
                let metadata = generate_metadata(study_id)?;
                Ok(metadata)
            }
            _ => Err(ApplicationError::StudyNotSaved),
        }
    }
}
