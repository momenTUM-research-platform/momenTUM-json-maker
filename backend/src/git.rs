pub mod git {

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
}
