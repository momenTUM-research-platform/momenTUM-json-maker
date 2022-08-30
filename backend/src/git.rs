pub mod git {
    use fancy_regex::Regex;
    use std::iter::zip;
    use std::process::Command;
    use std::{fs, process::Output};

    use crate::study::Metadata;
    use crate::{Error, Result};

    pub fn init_study_repository() {
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

    fn handle_result(result: std::io::Result<Output>) -> Result<()> {
        // Turn into trait
        match result {
            Ok(result) => {
                if result.status.success() {
                    println!("{}", String::from_utf8_lossy(&result.stdout));
                    Ok(())
                } else {
                    let s = format!(
                        "Error: {} {} ",
                        String::from_utf8_lossy(&result.stdout),
                        String::from_utf8_lossy(&result.stderr)
                    );
                    println!("{s}");
                    Err(Error::GitError(s))
                }
            }
            Err(error) => {
                let s = format!("{}", error);
                println!("{s}");
                Err(Error::GitError(s))
            }
        }
    }

    pub fn add_study(study_id: &str) -> Result<()> {
        let result = Command::new("git")
            .args([
                "-C",
                "studies",
                "add",
                format!("{}.json", study_id).as_str(),
            ])
            .output();
        handle_result(result)
    }

    pub fn commit_study(study_id: &str) -> Result<()> {
        let result = Command::new("git")
            .args([
                "-C",
                "studies",
                "commit",
                "-m",
                format!("Uploaded study {}", study_id).as_str(),
            ])
            .output();

        handle_result(result)
    }

    pub fn push_study() -> Result<()> {
        let result = Command::new("git").args(["-C", "studies", "push"]).output();

        handle_result(result)
    }

    // pub fn checkout(commit: Option<&String>) -> Result<()> {
    //     if let Some(commit) = commit {
    //         let result = Command::new("git")
    //             .args(["-C", "studies", "checkout", commit.as_str()])
    //             .output();
    //         match result {
    //             Ok(result) => {
    //                 if result.status.success() {
    //                     Ok(())
    //                 } else {
    //                     println!("{}", String::from_utf8_lossy(&result.stderr));
    //                     Err(Error::CheckoutError(
    //                         commit.to_string(),
    //                         String::from_utf8_lossy(&result.stderr).to_string(),
    //                     ))
    //                 }
    //             }
    //             Err(_) => Err(Error::CheckoutError(
    //                 commit.to_string(),
    //                 "Unknown error".to_string(),
    //             )),
    //         }
    //     } else {
    //         Ok(())
    //     }
    // }
    // if git ever changes its log syntax, this will break
    pub fn generate_metadata(study_id: &str) -> Result<Metadata> {
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
                            "https://tuspl22-momentum.srv.mwn.de/api/v1/studies/".to_string()
                                + study_id,
                        ),

                        commit: hash.unwrap().get(0).unwrap().as_str().to_string(),
                        timestamp: timestamp(date.unwrap().get(0).unwrap().as_str()),
                    };
                    Ok(metadata)
                } else {
                    println!("{}", String::from_utf8_lossy(&result.stderr));
                    Err(Error::GenerateMetadataError)
                }
            }
            Err(_) => Err(Error::GenerateMetadataError),
        }
    }

    pub fn timestamp(date: &str) -> i64 {
        chrono::prelude::DateTime::parse_from_str(date, "%a %b %e %T %Y %z")
            .unwrap()
            .timestamp_millis()
    }
}
