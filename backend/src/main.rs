use actix_cors::Cors;
use actix_web::{middleware::Logger, web, App, HttpServer};
use api::*;
use dotenv::dotenv;
use std::env;
use std::sync::Mutex;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let keys = init_api_keys();
    let payloads = init_payloads();
    let studies = init_study_repository();
    let uri = env::var("MONGODB_URI");
    let client = Client::with_uri_str(uri).await?;

    let app_data = web::Data::new(State {
        payloads: Mutex::new(payloads),
        keys: Mutex::new(keys),
        studies: Mutex::new(studies),
        client,
    });

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
    .worker_max_blocking_threads(2048)
    .run()
    .await
}
