use std::sync::Mutex;

use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use api::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let keys = init_api_keys();
    let payloads = init_payloads();
    let app_data = web::Data::new(State {
        payloads: Mutex::new(payloads),
        keys: Mutex::new(keys),
    });
    init_study_repository();

    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .app_data(app_data.clone())
            .service(greet)
            .service(fetch_study_by_commit)
            .service(fetch_study)
            .service(all_studies)
            .service(create_study)
            .service(save_response)
            .service(save_key)
            .default_service(web::get().to(missing_route))
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}
