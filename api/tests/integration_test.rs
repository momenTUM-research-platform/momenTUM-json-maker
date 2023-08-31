mod common;

#[cfg(test)]
mod integration_tests {

    use super::common;
    use crate::common::{read_file_content, setup};
    use api::Log;
    use api::Response;
    use fake::faker::company::en::{Bs, CatchPhase};
    use fake::faker::lorem::en::Sentence;
    use fake::Fake;
    use rocket::http::{ContentType, Status};
    use serde_urlencoded;

    fn greet() {
        println!("Hello! Setting up the test base .....");
    }

    #[test]
    fn test_greet() {
        common::setup();
        greet();
    }

    #[test]
    fn test_status() {
        let _client = setup().lock().unwrap();
        // Add assertions or test the behavior of the _client
        // You can access the client using the `_client` variable
        // e.g., assert_eq!(client.some_method(), expected_result);
        let response = _client.get("/api/v1/status").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.content_type(), Some(ContentType::Plain));
    }

    #[test]
    fn test_save_log() {
        let log = Log {
            data_type: "log".to_string(),
            user_id: "20771566-8976-4b68-864c-66e1e4f832e8".to_string(),
            study_id: "test".to_string(),
            module_index: 787,
            platform: "android".to_string(),
            page: "port".to_string(),
            event: "optical".to_string(),
            timestamp: "2022-09-26T12:38:30.509Z".to_string(),
            timestamp_in_ms: 1664195911,
        };

        let form_data =
            serde_urlencoded::to_string(&log).expect("Failed to serialize Log to form data");
        let _client = setup().lock().unwrap();

        let response = _client
            .post("/api/v1/log")
            .header(ContentType::Form)
            .body(form_data)
            .dispatch();

        assert_eq!(response.status(), Status::Ok);
    }

    #[test]
    fn test_save_response() {
        let _client = setup().lock().unwrap();

        let _response = Response {
            data_type: "log".to_string(),
            user_id: "20771566-8976-4b68-864c-66e1e4f832e8".to_string(),
            study_id: CatchPhase().fake(),
            module_index: 123,
            platform: Bs().fake(),
            module_id: "module_123".to_string(),
            module_name: Sentence(3..5).fake(),
            responses: None,
            entries: None,
            response_time: "2022-09-26T12:38:30.509Z".to_string(),
            response_time_in_ms: 1664195911,
            alert_time: "2022-09-26T12:38:30.509Z".to_string(),
        };

        let form_data = serde_urlencoded::to_string(&_response)
            .expect("Failed to serialize Response to form data");

        let response = _client
            .post("/api/v1/response")
            .header(ContentType::Form)
            .body(form_data)
            .dispatch();

        assert_eq!(response.status(), Status::Unauthorized);
    }

    #[test]
    fn test_fetch_study() {
        let _client = setup().lock().unwrap();
        let response = _client.get("/api/v1/studies/acticut_v6").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.content_type(), Some(ContentType::JSON));

        // TBD
        // let study_json = json!({
        //     "_id": "789",
        //     "properties": {
        //         "study_id": "789",
        //         // other study properties
        //     },
        //     // other study fields
        // });
        // assert_eq!(response.status(), Status::Ok);
        // let response_json: Value =
        //     serde_json::from_str(response.into_string().unwrap().as_str()).unwrap();
        // assert_eq!(response_json, study_json);
    }

    #[test]
    fn test_fetch_study_not_found() {
        let _client = setup().lock().unwrap();
        // Mock a 404 response
        let response = _client.get("/api/v1/studies/456").dispatch();
        assert_eq!(response.status(), Status::NotFound);
        // Add more assertions based on your expected error handling
    }

    #[test]
    fn test_create_study() {
        let _client = setup().lock().unwrap();
        let potential_study = read_file_content("./tests/uploads/example.json");

        let response = _client
            .post("/api/v1/study")
            .header(ContentType::JSON)
            .body(potential_study)
            .dispatch();

        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.content_type(), Some(ContentType::Text));
        
        let body_str = response.into_string().unwrap();
        assert!(body_str.starts_with("ObjectId"));
    }
    #[test]
    fn test_all_studies_of_study_id() {
        let _client = setup().lock().unwrap();

        let study_id = "test_study".to_string();

        let response = _client
            .get(format!("/api/v1/studies/all/{}", study_id))
            .dispatch();

        assert_eq!(response.status(), Status::Ok);
        // let studies: Vec<Study> = serde_json::from_str(&response.into_string().unwrap()).unwrap();
        // Assert further based on the expected behavior
    }

    // TODO
    // all_studies,
    // create_redcap_project,
    // add_user,
    // docs_assets,
}
