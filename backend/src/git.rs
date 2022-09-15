pub mod git {
    use fancy_regex::Regex;
    use std::process::Command;
    use std::{fs, process::Output};

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

    pub fn commit_study(study_id: &str) -> Result<String> {
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
                    let output = String::from_utf8_lossy(&result.stdout);
                    let hash_regex = Regex::new(r"(/(?<= )(.*)(?=])/m)").unwrap();
                    let captures = hash_regex.captures_iter(&output);
                    let first_commit = captures.next().unwrap().unwrap().get(1).unwrap().as_str();
                    println!("Saved study on commit: {}", first_commit);
                    Ok(first_commit.to_string())
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

    pub fn push_study() -> Result<()> {
        let result = Command::new("git").args(["-C", "studies", "push"]).output();

        handle_result(result)
    }

    pub fn checkout(branch: &str) -> Result<()> {
        let result = Command::new("git")
            .args(["-C", "studies", "checkout", branch])
            .output();
        handle_result(result)
    }
}
