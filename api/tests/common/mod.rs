use api::lazy_static::lazy_static;
use api::rocket;
use rocket::local::blocking::Client;

use std::sync::{Arc, Mutex};

lazy_static! {
    static ref CLIENT: Arc<Mutex<Client>> = Arc::new(Mutex::from(Client::tracked(rocket()).expect("valid rocket instance")));
}

pub fn setup () -> &'static Arc<Mutex<Client>> {
    &*CLIENT
}