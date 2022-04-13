import { Validator } from 'jsonschema'
import schema from './schema.json' assert { type: 'json'}
import schema2 from './schema2.json' assert { type: 'json'}
import example from './example.json' assert {type: 'json'}
const v = new Validator()
const result = v.validate(example, schema2)
console.log(result.valid)