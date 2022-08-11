pub mod git {

    use crate::structs::structs::*;
    use fancy_regex::{Captures, Regex};
    use std::fs;
    use std::iter::zip;
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

    pub fn add_study(study_id: &str) -> Result<(), ApplicationError> {
        let result = Command::new("git")
            .args([
                "-C",
                "studies",
                "add",
                format!("{}.json", study_id).as_str(),
            ])
            .output();
        match result {
            Ok(result) => {
                if result.status.success() {
                    println!("{}", String::from_utf8_lossy(&result.stdout));
                    Ok(())
                } else {
                    println!("{}", String::from_utf8_lossy(&result.stderr));
                    Err(ApplicationError::AddError)
                }
            }
            Err(_) => Err(ApplicationError::AddError),
        }
    }

    pub fn commit_study(study_id: &str) -> Result<(), ApplicationError> {
        let result = Command::new("git")
            .args([
                "-C",
                "studies",
                "commit",
                "-m",
                format!("Uploaded study {}", study_id).as_str(),
            ])
            .output();

        match result {
            Ok(result) => {
                if result.status.success() {
                    println!("{}", String::from_utf8_lossy(&result.stdout));
                    Ok(())
                } else if String::from_utf8_lossy(&result.stdout)
                    .contains("nothing to commit, working tree clean")
                {
                    println!("{}", String::from_utf8_lossy(&result.stdout));
                    Ok(())
                } else {
                    println!(
                        "Error: {} {} ",
                        String::from_utf8_lossy(&result.stdout),
                        String::from_utf8_lossy(&result.stderr)
                    );
                    Err(ApplicationError::CommitError)
                }
            }

            Err(error) => {
                println!("{}", error);
                Err(ApplicationError::CommitError)
            }
        }
    }

    pub fn push_study() -> Result<(), ApplicationError> {
        let result = Command::new("git").args(["-C", "studies", "push"]).output();

        match result {
            Ok(result) => {
                if result.status.success() {
                    println!("{}", String::from_utf8_lossy(&result.stdout));
                    Ok(())
                } else {
                    println!("{}", String::from_utf8_lossy(&result.stderr));
                    Err(ApplicationError::PushError)
                }
            }
            Err(_) => Err(ApplicationError::PushError),
        }
    }

    pub fn checkout(commit: &String) -> Result<(), ApplicationError> {
        let result = Command::new("git")
            .args(["-C", "studies", "checkout", commit.as_str()])
            .output();
        match result {
            Ok(result) => {
                if result.status.success() {
                    println!("{}", String::from_utf8_lossy(&result.stdout));
                    Ok(())
                } else {
                    println!("{}", String::from_utf8_lossy(&result.stderr));
                    Err(ApplicationError::CheckoutError(
                        commit.to_string(),
                        String::from_utf8_lossy(&result.stderr).to_string(),
                    ))
                }
            }
            Err(_) => Err(ApplicationError::CheckoutError(
                commit.to_string(),
                "Unknown error".to_string(),
            )),
        }
    }
    // if git ever changes its log syntax, this will break
    pub fn generate_metadata(study_id: &str) -> Result<Metadata, ApplicationError> {
        let result = Command::new("git")
            .args(["-C", "studies", "log", &(study_id.to_string() + ".json")])
            .output();

        match result {
            Ok(result) => {
                if result.status.success() {
                    let output = String::from_utf8_lossy(&result.stdout);
                    let hash_regex = Regex::new(r"(?<=commit )(.*)(?=\n)").unwrap();
                    let date_regex = Regex::new(r"(?<=Date:   )(.*)(?=\n)").unwrap();
                    let hashes = hash_regex.captures_iter(&output);
                    let dates = date_regex.captures_iter(&output);

                    let metadata = Metadata {
                        url: String::from(
                            "https://tuspl22-momentum.srv.mwn.de/api/v1/study/".to_string()
                                + study_id,
                        ),
                        commits: zip(hashes, dates)
                            .map(|(hash, date)| Commit {
                                id: hash.unwrap().get(0).unwrap().as_str().to_string(),
                                timestamp: timestamp(date.unwrap().get(0).unwrap().as_str()),
                            })
                            .collect(),
                    };
                    Ok(metadata)
                } else {
                    println!("{}", String::from_utf8_lossy(&result.stderr));
                    Err(ApplicationError::GenerateMetadataError)
                }
            }
            Err(_) => Err(ApplicationError::GenerateMetadataError),
        }
    }

    pub fn timestamp(date: &str) -> i64 {
        chrono::prelude::DateTime::parse_from_str(date, "%a %b %e %T %Y %z")
            .unwrap()
            .timestamp_millis()
    }
}
