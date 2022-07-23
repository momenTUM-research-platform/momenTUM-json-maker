#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        http::{self},
        test, HttpResponse,
    };

    #[actix_web::test]
    async fn test_greet() {
        let req = test::TestRequest::with_uri("/api/v1/status")
            .to_http_request()
        let res = handler   
        assert_eq!(response.status(), http::StatusCode::OK);
    }
}
