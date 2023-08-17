use std::fs::File;
use std::io::Read;
use api::lazy_static::lazy_static;
use api::rocket;
use api::DB;
use api::{
    status, get_study_by_post, create_study, fetch_study, all_studies, save_log, save_response,
    create_redcap_project, all_studies_of_study_id, add_user, docs_assets,
};
use rocket::{local::blocking::Client, routes};
use rocket_db_pools::Database;
use std::sync::{Arc, Mutex};


lazy_static! {
    static ref CLIENT: Arc<Mutex<Client>> = {
        let rocket = rocket::build().attach(DB::init());
        let client = Client::tracked(rocket.mount("/", routes![
            status,
            get_study_by_post,
            create_study,
            fetch_study,
            all_studies,
            save_log,
            save_response,
            create_redcap_project,
            all_studies_of_study_id,
            add_user,
            docs_assets,
        ]));

        Arc::new(Mutex::new(client.expect("valid rocket instance")))
    };
}

#[allow(dead_code)]
pub fn read_file_content(file_path: &str) -> String {
    let mut file = File::open(file_path).expect("failed to open file");
    let mut content = String::new();
    file.read_to_string(&mut content).expect("failed to read file");
    content
}

pub fn setup() -> &'static Arc<Mutex<Client>> {
    &*CLIENT
}
