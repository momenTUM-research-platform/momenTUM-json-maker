use std::sync::Mutex;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use api::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let keys = init_api_keys();
    let app_data = web::Data::new(AppState {
        keys: Mutex::new(keys),
    });
    init_study_repository();

    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .app_data(app_data.clone())
            .service(greet)
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
