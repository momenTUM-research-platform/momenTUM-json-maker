import toast from "react-hot-toast";
import { API_URL } from "../App";
import { useStore } from "../State";
import { constructStudy } from "../utils/construct";
import { deconstructStudy } from "../utils/deconstruct";
import fetch from "cross-fetch";
import {
  validateEachNode,
  validateStudyFromObj,
  validateStudy,
} from "./validations";

export function validate() {
  const { atoms } = useStore.getState();
  const study = constructStudy(atoms);
  const { true_conditions, qIds, mIds } = getStudyCQMFromAtom(study);
  try {
    validateEachNode(atoms, true_conditions, qIds, mIds);
    validateStudy(study) && toast.success("Study is valid");
  } catch (err: any) {
    return false;
  }
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
        toast.success("Loaded Successfully!");
      } else {
        toast.error("Error while loading study!");
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

export function getStudyCQMFromAtom(study: any): {
  true_conditions: string[];
  qIds: SchemaEnum[];
  mIds: SchemaEnum[];
} {
  const { atoms } = useStore.getState();
  const qIds: SchemaEnum[] = [{ id: "none", text: "None" }];
  const mIds: SchemaEnum[] = [];

  for (const [key, value] of atoms.entries()) {
    if (value.content?._type === "question") {
      qIds.push({ id: key, text: value.content.text });
    }
    if (value.content?._type === "module") {
      mIds.push({ id: key, text: value.content.name });
    }
  }

  let true_conditions: string[] = ["*"];
  try {
    const c = study?.properties?.conditions;
    if (c) {
      true_conditions.push(...c);
    }
  } catch (err: any) {
    console.error(err);
    toast.error("Conditions error: " + err.message);
    return { true_conditions: [], qIds: qIds, mIds: mIds };
  }

  return { true_conditions, qIds, mIds };
}
