use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use api::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    init_study_repository();
    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(init_api_keys()))
            .service(greet)
            .service(fetch_study)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
