// Tests

mod common;

#[cfg(test)]
mod database_tests {

    use super::common;
    use api;

    fn greet() {
        println!("Hello! Setting up the test base .....");
    }

    #[test]
    fn test_greet() {
        common::setup();
        greet();
    }


    #[test]
    fn deserialize_study() {
        let json = include_str!("../../studies/maydel.json");
        let study: api::Study = serde_json::from_str(json).unwrap();
        assert_eq!(study.properties.study_id, "acticut_v6");
        assert_eq!(study.properties.created_by, "Maydel Fernandez-Alonso");
    }
    #[test]
    fn deserialize_alert() {
        let json = r#"
            {
                "title": "Wear LOG",
                "message": "Remember to log your watch wear!",
                "duration": 20,
                "times": [
                    {
                        "hours": 18,
                        "minutes": 30
                    }
                ],
                "random": false,
                "random_interval": 0,
                "sticky": true,
                "sticky_label": "logs",
                "timeout": false,
                "timeout_after": 0,
                "start_offset": 0
            }
        "#;
    
        let alert: api::Alert = serde_json::from_str(json).unwrap();
    
        assert_eq!(alert.title, "Wear LOG");
    }
    
    #[test]
    fn test_pvt() {
        let json = include_str!("../../studies/angle.json");
        let study: api::Study = serde_json::from_str(json).unwrap();
        let pvt: &api::Params = &study.modules[3].params;
        match pvt {
            api::Params::Pvt(pvt) => {
                assert_eq!(pvt.min_waiting, 200);
                assert!(pvt.max_waiting > 200);
                assert!(pvt.max_reaction > pvt.max_waiting);
            }
            _ => panic!("Expected a pvt module"),
        }
    }

    #[test]
    fn test_survey() {
        let json = include_str!("../../studies/angle.json");
        let study: api::Study = serde_json::from_str(json).unwrap();
        let survey = &study.modules[0].params;
        match survey {
            api::Params::Survey(survey) => {
                assert_eq!(survey.sections.len(), 1);
            }
            _ => panic!("Expected a survey module"),
        }
    }
}
