import Ajv from "ajv";
import { paramsSurvey } from "../../schema/paramsSurvey";
import { paramsPVT } from "../../schema/paramsPVT";
import { section as section_schema } from "../../schema/section";
import { question as question_schema } from "../../schema/question";
import { module as module_schema } from "../../schema/module";
import { properties as properties_schema } from "../../schema/properties";
import { isStudy } from "../types/guards";
import toast from "react-hot-toast";
import { study_object as study_schema } from "../../schema/study_object";
import { betterAjvErrors } from "@apideck/better-ajv-errors";
import { getStudyCQMFromAtom } from './actions';



// Function to validate a study object
export function validateProperties(properties: Properties) {
    // Create an instance of Ajv
const ajv = new Ajv({ allErrors: true });
ajv.addKeyword("enumNames");
  const schema = properties_schema;
  const validator = ajv.compile(schema);
  const is_valid = validator(properties);

  if (!is_valid) {
    const errors = validator.errors;
    const beautifiedErrors = betterAjvErrors({
      schema,
      data: properties,
      errors: errors,
      basePath: "Properties",
    });
    const errorMessages = beautifiedErrors.map((err) => err.message);
    for (const errorMessage of errorMessages) {
      toast.error(errorMessage!);
    }
    throw new Error("Properties");
  }
  return;
}

// Function to validate a module object
export function validateModule(
  module: Module,
  conditions: string[],
  qIds: SchemaEnum[],
  mIds: SchemaEnum[]
) {
    // Create an instance of Ajv
const ajv = new Ajv({ allErrors: true });
ajv.addKeyword("enumNames");
  const schema = module_schema(conditions, qIds, mIds);
  const validator = ajv.compile(schema);
  const is_valid = validator(module);

  if (!is_valid) {
    const errors = validator.errors;

    const beautifiedErrors = betterAjvErrors({
      schema,
      data: module,
      errors: errors,
      basePath: "Module",
    });
    const errorMessages = beautifiedErrors.map((err) => err.message);
    for (const errorMessage of errorMessages) {
      toast.error(errorMessage!);
    }
    throw new Error("Module");
  }
  return;
}

// Function to validate a params object
export function validateParams(params: Params, qIds: SchemaEnum[]) {
    // Create an instance of Ajv
const ajv = new Ajv({ allErrors: true });
ajv.addKeyword("enumNames");
  if (params.type == "survey") {
    const schema = paramsSurvey(qIds);
    const validator = ajv.compile(schema);
    const is_valid = validator(params);
    if (!is_valid) {
      const errors = validator.errors;

      const beautifiedErrors = betterAjvErrors({
        schema,
        data: params,
        errors: errors,
        basePath: "Survey",
      });
      const errorMessages = beautifiedErrors.map((err) => err.message);
      for (const errorMessage of errorMessages) {
        toast.error(errorMessage!);
      }
      throw new Error("Survey");
    }
    return;
  } else {
    const schema = paramsPVT;
    const validator = ajv.compile(paramsPVT);
    const is_valid = validator(params);

    if (!is_valid) {
      const errors = validator.errors;

      const beautifiedErrors = betterAjvErrors({
        schema,
        data: params,
        errors: errors,
        basePath: "PVT",
      });
      const errorMessages = beautifiedErrors.map((err) => err.message);
      for (const errorMessage of errorMessages) {
        toast.error(errorMessage!);
      }
      throw new Error("PVT");
    }

    return;
  }
}

// Function to validate a section object
export function validateSection(section: Section) {
    // Create an instance of Ajv
const ajv = new Ajv({ allErrors: true });
ajv.addKeyword("enumNames");
  const schema = section_schema;
  const validator = ajv.compile(section_schema);
  const is_valid = validator(section);

  if (!is_valid) {
    const errors = validator.errors;

    const beautifiedErrors = betterAjvErrors({
      schema,
      data: section,
      errors: errors,
      basePath: "Section",
    });
    const errorMessages = beautifiedErrors.map((err) => err.message);
    for (const errorMessage of errorMessages) {
      toast.error(errorMessage!);
    }
    throw new Error("Section");
  }
  return;
}

// Function to validate a section object
export function validateQuestions(question: Question, qIds: SchemaEnum[]) {
    // Create an instance of Ajv
const ajv = new Ajv({ allErrors: true });
ajv.addKeyword("enumNames");
  const schema = question_schema(qIds);
  const validator = ajv.compile(question_schema(qIds));
  const is_valid = validator(question);

  if (!is_valid) {
    const errors = validator.errors;

    const beautifiedErrors = betterAjvErrors({
      schema,
      data: question,
      errors: errors,
      basePath: "Questions",
    });
    const errorMessages = beautifiedErrors.map((err) => err.message);
    for (const errorMessage of errorMessages) {
      toast.error(errorMessage!);
    }
    throw new Error("Questions");
  }
  return;
}

export function validateEachNode(
  atoms: Atoms,
  conditions: string[],
  qIds: SchemaEnum[],
  mIds: SchemaEnum[]
): void {
  const start = JSON.parse(JSON.stringify(atoms.get("study"))) as Atom<Study>;
  validateNode(start);

  function validateNode<T>(atom: Atom<T>): void {
    if (isStudy(atom.content)) {
      const properties = atoms.get("properties")?.content as Properties;
      validateProperties(properties);
    }

    atom.subNodes?.forEach((id) => {
      const node = atoms.get(id);
      if (node) {
        const copy = JSON.parse(JSON.stringify(node)); // Copy
        validateNode(copy);

        switch (node.content._type) {
          case "module":
            validateModule(copy.content, conditions, qIds, mIds);
            break;

          case "params":
            validateParams(copy.content, qIds);
            break;

          case "section":
            validateSection(copy.content);
            break;

          case "question":
            validateQuestions(copy.content, qIds);
            break;
        }
      }
    });
  }
}
export function validateStudyFromObj(study_obj: any) {
  const qIds: SchemaEnum[] = [{ id: "none", text: "None" }];
  const mIds: SchemaEnum[] = [];
  const studyParams = [];
  let questions;

  for (const { id, name, params } of study_obj.modules) {
    mIds.push({ id, text: name });
    studyParams.push(params);
  }

  for (const { type } of studyParams) {
    if (type === "survey") {
      const sections = study_obj.modules
        .flatMap((module: any) => module.params.sections || [])
        .filter(
          (section: any) => section.questions && section.questions.length > 0
        );

      questions = sections.flatMap((section: any) => section.questions);
    }
  }

  if (questions != null && questions.length > 0) {
    for (const { id, text, _type } of questions) {
      if (_type === "question") {
        qIds.push({ id, text: text });
      }
    }
  }

  let true_conditions = ["*"];
  try {
    const c = study_obj.properties.conditions;
    if (c) true_conditions.push(...c);
  } catch (err: any) {
    console.error(err);
    toast.error("Conditions error: " + err.message);
    return false;
  }
 
  const schema = study_schema(true_conditions, qIds, mIds);
  const ajv = new Ajv();
  ajv.addKeyword("enumNames");
  const validator = ajv.compile(schema);

  const is_valid = validator(study_obj);

  if (is_valid) {
    return true;
  } else {
    toast.error("Study is invalid");
    const errors = validator.errors;
    const beautifiedErrors = betterAjvErrors({
      schema,
      data: study_obj,
      errors: errors,
      basePath: "study",
    });
    const errorMessages = beautifiedErrors.map((err) => err.message);
    for (const errorMessage of errorMessages) {
      console.log(errorMessage);
      toast.error(errorMessage!);
    }

    return false;
  }
}
export function validateStudy(study: any): study is Study {
  // Create an instance of Ajv
  const ajv = new Ajv({ allErrors: true });
  ajv.addKeyword("enumNames");
  const { true_conditions, qIds, mIds } = getStudyCQMFromAtom(study);
  const schema = study_schema(true_conditions, qIds, mIds);


  try {
    const validator = ajv.compile(schema);
    const is_valid = validator(study);
   
    if (is_valid) {
      return true;
    } else {
      toast.error("Study is invalid");
      const errors = validator.errors;
      const beautifiedErrors = betterAjvErrors({
        schema,
        data: study,
        errors: errors,
        basePath: "study",
      });
      const errorMessages = beautifiedErrors.map((err) => err.message);
      for (const errorMessage of errorMessages) {
        console.log(errorMessage);
        toast.error(errorMessage!);
      }
      return false;
    }
  } catch (err: any) {
    console.log("Error Message: ", err);
    toast.error("Study is invalid due to an error.");
    const beautifiedErrors = betterAjvErrors({
      schema,
      data: study,
      errors: err,
      basePath: "study",
    });
    const errorMessages = beautifiedErrors.map((err) => err.message);
    for (const errorMessage of errorMessages) {
      console.log(errorMessage);
      toast.error(errorMessage!);
    }
    return false;
  }
}