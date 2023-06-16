
mod common;

#[cfg(test)]
mod tests {

    fn greet() {
        println!("Hello!")
    }
    
    #[test]
    fn test_greet() {
        greet();
    }
}
