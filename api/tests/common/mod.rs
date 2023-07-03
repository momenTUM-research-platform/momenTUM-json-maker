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

pub fn setup() -> &'static Arc<Mutex<Client>> {
    &*CLIENT
}
