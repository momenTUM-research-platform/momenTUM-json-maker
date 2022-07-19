from server import collect_and_upload
import time


class TestCollectAndUpload:
    def test_none_when_empty(self):
        cache = {}
        user_id = "2"
        assert collect_and_upload(cache, user_id, True) == None

    def test_some_when_not_empty(self):
        user_id = "one"
        cache = {}
        cache[time.time_ns()] = {
            "module_index": 0,
            "module_name": "module_one",
            "user_id": user_id,
            "study_id": "two",
            "response_time_in_ms": 123,
            "response_time": "2022-07-11T11:25:07+02:00",
            "responses": "{}",
        }
        expected = {
            "raw_data": [
                {
                    "module_index": 0,
                    "module_name": "module_one",
                    "user_id": user_id,
                    "study_id": "two",
                    "response_time_in_ms": 123,
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "responses": "{}",
                }
            ],
            "record_id": "1",
            "redcap_repeat_instance": "3",
            "redcap_repeat_instrument": "module_one",
            "response_time_in_ms": 123,
            "response_time": "2022-07-11T11:25:07+02:00",
            "study_id": "two",
            "user_id": "one",
        }
        assert collect_and_upload(cache, user_id, True) == expected

    def test_include_responses(self):
        user_id = "one"
        cache = {}
        responses = '{"question_one": "answer_one", "question_two": "answer_two"}'
        cache[time.time_ns()] = {
            "module_index": 0,
            "module_name": "module_one",
            "user_id": user_id,
            "study_id": "two",
            "response_time": "2022-07-11T11:25:07+02:00",
            "response_time_in_ms": 123,
            "responses": responses,
        }
        expected = {
            "raw_data": [
                {
                    "module_index": 0,
                    "module_name": "module_one",
                    "user_id": user_id,
                    "study_id": "two",
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "response_time_in_ms": 123,
                    "responses": responses,
                }
            ],
            "question_one": "answer_one",
            "question_two": "answer_two",
            "record_id": "1",
            "redcap_repeat_instance": "3",
            "redcap_repeat_instrument": "module_one",
            "response_time_in_ms": 123,
            "response_time": "2022-07-11T11:25:07+02:00",
            "study_id": "two",
            "user_id": "one",
        }
        assert collect_and_upload(cache, user_id, True) == expected

    def test_cache_of_multiple_users(self):
        user_ids = ["one", "two", "three"]
        cache = {}
        for user_id in user_ids:
            cache[time.time_ns()] = {
                "module_index": 0,
                "module_name": "module_one",
                "user_id": user_id,
                "study_id": "two",
                "response_time_in_ms": 123,
                "response_time": "2022-07-11T11:25:07+02:00",
                "responses": "{}",
            }
        for user_id in user_ids:
            expected = {
                "raw_data": [
                    {
                        "module_index": 0,
                        "module_name": "module_one",
                        "user_id": user_id,
                        "study_id": "two",
                        "response_time_in_ms": 123,
                        "response_time": "2022-07-11T11:25:07+02:00",
                        "responses": "{}",
                    }
                ],
                "record_id": "1",
                "redcap_repeat_instance": "3",
                "redcap_repeat_instrument": "module_one",
                "response_time_in_ms": 123,
                "response_time": "2022-07-11T11:25:07+02:00",
                "study_id": "two",
                "user_id": user_id,
            }
            assert collect_and_upload(cache, user_id, True) == expected

    def test_collection_of_events(self):
        user_id = "one"
        cache = {}
        responses = '{"question_one": "answer_one", "question_two": "answer_two"}'
        for i in range(3):
            cache[time.time_ns()] = {
                "module_index": 0,
                "module_name": "module_one",
                "user_id": user_id,
                "study_id": "two",
                "response_time_in_ms": i * 100,
                "response_time": "2022-07-11T11:25:07+02:00",
                "responses": responses,
            }
        expected = {
            "raw_data": [
                {
                    "module_index": 0,
                    "module_name": "module_one",
                    "user_id": user_id,
                    "study_id": "two",
                    "response_time_in_ms": 0,
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "responses": responses,
                },
                {
                    "module_index": 0,
                    "module_name": "module_one",
                    "user_id": user_id,
                    "study_id": "two",
                    "response_time_in_ms": 100,
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "responses": responses,
                },
                {
                    "module_index": 0,
                    "module_name": "module_one",
                    "user_id": user_id,
                    "study_id": "two",
                    "response_time_in_ms": 200,
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "responses": responses,
                },
            ],
            "question_one": "answer_one",
            "question_two": "answer_two",
            "record_id": "1",
            "redcap_repeat_instance": "3",
            "redcap_repeat_instrument": "module_one",
            "response_time_in_ms": 0,
            "response_time": "2022-07-11T11:25:07+02:00",
            "study_id": "two",
            "user_id": "one",
        }
        assert collect_and_upload(cache, user_id, True) == expected

    def test_collection_of_events_with_heterogeneous_responses(self):

        user_id = "one"
        cache = {}
        responses = '{"question_one": "answer_one", "question_two": "answer_two"}'
        cache[time.time_ns()] = {
            "module_index": 0,
            "module_name": "module_one",
            "user_id": user_id,
            "study_id": "two",
            "response_time_in_ms": 100,
            "response_time": "2022-07-11T11:25:07+02:00",
            "responses": "{}",
        }
        cache[time.time_ns()] = {
            "module_index": 0,
            "module_name": "module_one",
            "user_id": user_id,
            "study_id": "two",
            "response_time_in_ms": 200,
            "response_time": "2022-07-11T11:25:07+02:00",
            "responses": responses,
        }
        cache[time.time_ns()] = {
            "module_index": 0,
            "module_name": "module_one",
            "user_id": user_id,
            "study_id": "two",
            "response_time_in_ms": 300,
            "response_time": "2022-07-11T11:25:07+02:00",
            "responses": "{}",
        }
        expected = {
            "raw_data": [
                {
                    "module_index": 0,
                    "module_name": "module_one",
                    "user_id": user_id,
                    "study_id": "two",
                    "response_time_in_ms": 100,
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "responses": "{}",
                },
                {
                    "module_index": 0,
                    "module_name": "module_one",
                    "user_id": user_id,
                    "study_id": "two",
                    "response_time_in_ms": 200,
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "responses": responses,
                },
                {
                    "module_index": 0,
                    "module_name": "module_one",
                    "user_id": user_id,
                    "study_id": "two",
                    "response_time_in_ms": 300,
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "responses": "{}",
                },
            ],
            "question_one": "answer_one",
            "question_two": "answer_two",
            "record_id": "1",
            "redcap_repeat_instance": "3",
            "redcap_repeat_instrument": "module_one",
            "response_time_in_ms": 100,
            "response_time": "2022-07-11T11:25:07+02:00",
            "study_id": "two",
            "user_id": "one",
        }
        assert collect_and_upload(cache, user_id, True) == expected

    def test_pvt(self):
        user_id = "one"
        cache = {}
        pvt = {
            "module_index": 0,
            "user_id": user_id,
            "study_id": "two",
            "module_name": "pvt module name",
            "entries": [321, 423, 123, -1, -2, 124, 132],
            "response_time": "2022-07-11T11:25:07+02:00",
            "response_time_in_ms": 1657531507496,
        }
        cache[time.time_ns()] = pvt
        expected = {
            "raw_data": [
                {
                    "module_index": 0,
                    "user_id": user_id,
                    "study_id": "two",
                    "module_name": "pvt module name",
                    "entries": [321, 423, 123, -1, -2, 124, 132],
                    "response_time": "2022-07-11T11:25:07+02:00",
                    "response_time_in_ms": 1657531507496,
                }
            ],
            "entries": [321, 423, 123, -1, -2, 124, 132],
            "record_id": "1",
            "redcap_repeat_instance": "3",
            "redcap_repeat_instrument": "pvt module name",
            "response_time_in_ms": 1657531507496,
            "response_time": "2022-07-11T11:25:07+02:00",
            "study_id": "two",
            "user_id": "one",
        }
        assert collect_and_upload(cache, user_id, True) == expected
