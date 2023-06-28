
mod common;

#[cfg(test)]
mod integration_tests {

    use rocket::http::{Status, ContentType};
    use crate::common::setup;
    use super::common;

    fn greet() {
        println!("Hello!")
    }
    
    #[test]
    fn test_greet() {
        common::setup();
        greet();
    }

    #[test]
    fn test_setup() {
        let _client = setup().lock().unwrap();
        // Add assertions or test the behavior of the _client
        // You can access the client using the `_client` variable
        // e.g., assert_eq!(client.some_method(), expected_result);
        let response = _client.get("/api/v1/status").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.content_type(), Some(ContentType::Plain));
    }
}
