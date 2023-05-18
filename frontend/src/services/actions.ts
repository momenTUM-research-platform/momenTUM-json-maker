import toast from "react-hot-toast";
import { API_URL } from "../App";
import { useStore } from "../state";
import { DefinedError } from "ajv";
import Ajv, { ValidateFunction } from "ajv";
import { constructStudy } from "../utils/construct";
import { deconstructStudy } from "../utils/deconstruct";
import fetch from "cross-fetch";
import { study as study_schema } from "../../schema/study";
import { studt_object as study_schema_all } from "../../schema/all";
import { section } from "../../schema/section";

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

  for (const { id, text, _type } of questions) {
    if (_type === "question") {
      qIds.push({ id, text: text });
    }
  }

  let true_conditions = ["*"];
  try {
    const c = study_obj.properties.conditions;
    if (c) true_conditions.push(...c);
  } catch (err) {
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
    const errors = validator.errors as DefinedError[];
    const err =
      errors.reduce((acc, e) => {
        const keyword = e.keyword.charAt(0).toUpperCase() + e.keyword.slice(1);
        return (
          acc + keyword + " error: " + e.instancePath + " " + e.message + "\n"
        );
      }, "") || "Unknown error";
    console.log(err);
    toast.error(err);
    return false;
  }
}

export function validateStudy(study: any): study is Study {
  const { conditions, atoms } = useStore.getState();
  const qIds: SchemaEnum[] = [{ id: "none", text: "None" }];
  const mIds: SchemaEnum[] = [];

  for (const [key, value] of atoms.entries()) {
    if (value.content._type === "question") {
      qIds.push({ id: key, text: value.content.text });
    }
    if (value.content._type === "module") {
      mIds.push({ id: key, text: value.content.name });
    }
  }

  let true_conditions = ["*"];
  try {
    const c = study.properties.conditions;
    if (c) true_conditions.push(...c);
  } catch (err) {
    console.error(err);
    toast.error("Conditions error: " + err.message);
    return false;
  }

  const schema = study_schema(true_conditions, qIds, mIds);
  const validator = new Ajv().compile(schema);
  const valid = validator(study);

  if (valid) {
    return true;
  } else {
    const errors = validator.errors as DefinedError[];
    const err =
      errors.reduce((acc, e) => {
        const keyword = e.keyword.charAt(0).toUpperCase() + e.keyword.slice(1);
        return (
          acc + keyword + " error: " + e.instancePath + " " + e.message + "\n"
        );
      }, "") || "Unknown error";
    toast.error(err);
    console.error(err);
    return false;
  }
}

export function validate() {
  const { atoms } = useStore.getState();
  validateStudy(constructStudy(atoms)) && toast.success("Study is valid");
}

export function save() {
  const { atoms } = useStore.getState();
  const data = JSON.stringify(constructStudy(atoms), null, 2);
  const uri = "data:application/json;charset=utf-8," + encodeURIComponent(data);
  const link = document.createElement("a");
  link.href = uri;
  link.download = "study.json";
  link.click();
}

export function load() {
  const { setAtoms } = useStore.getState();
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => {
    // @ts-ignore
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(reader.result as string);
      const deconstructed = deconstructStudy(data);
      const rebuild = constructStudy(deconstructed);
      // Validate the study, and show errors if any, but don't stop loading as this is a user action
      if (validateStudyFromObj(rebuild)) {
        setAtoms(deconstructed);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export async function upload(study: Study): Promise<string> {
  const data = JSON.stringify(study, null, 2);
  const postURL = API_URL + "/study";
  try {
    const response = await fetch(postURL, {
      method: "POST",
      body: data,
      redirect: "follow",
    });
    const body = await response.text();
    if (body.includes("ObjectId(")) {
      // Success
      return body.slice(10, -2); // ID of the uploaded study
    } else {
      throw body;
    }
  } catch (error) {
    let errorKind = error;
    if (typeof errorKind === "string") {
      const startIndex = errorKind.indexOf("Kind:");
      const endIndex = errorKind.indexOf("Topology");
      if (startIndex >= 0 && endIndex >= 0) {
        errorKind = errorKind.substring(startIndex + 5, endIndex).trim();
      }
    }

    console.error(`Error: ${errorKind}`);
    throw `Error: ${errorKind}`;
  }
}

export async function download(study_id: string): Promise<Study> {
  const uri = API_URL + "/studies/" + study_id;
  try {
    const response = await fetch(uri);
    if (response.ok) {
      return await response.json();
    } else {
      throw "Status: " + response.statusText + " " + (await response.text());
    }
  } catch (error) {
    console.error(error);
    throw "Error: " + error;
  }
}

export async function createRedcapProject(username: string, study: Study) {
  const uri = API_URL + "/redcap/" + username;
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(study),
      redirect: "follow",
    });
    if (response.ok) {
      return await response.text();
    } else {
      throw "Status: " + response.statusText + " " + (await response.text());
    }
  } catch (error) {
    console.error(error);
    throw "Error: " + error;
  }
}
