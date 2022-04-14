import schema from "./schema.json" assert { type: "json" };
import example from "./example.json" assert { type: "json" };
import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(example);

if (!valid) console.log(validate.errors);
console.log(valid);
