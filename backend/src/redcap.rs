pub mod redcap {
    use crate::structs::structs::Submission;

    pub fn import_response(data: Submission) {
        println!("{:?}", data);
    }
}
