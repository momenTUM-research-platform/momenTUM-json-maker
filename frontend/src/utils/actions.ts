import toast from "react-hot-toast";
import { API_URL } from "../App";
import { useStore } from "../state";
import { DefinedError } from "ajv";
import { constructStudy } from "./construct";
import { deconstructStudy } from "./deconstruct";

export function validateStudy(study: any): study is Study {
  const { validator } = useStore.getState();
  const valid = validator(study);
  if (valid) return true;
  const errors = validator.errors as DefinedError[];

  toast.error(
    errors.reduce(
      (acc, e) => acc + e.keyword + " error: " + e.instancePath + " " + e.message + "\n",
      ""
    ) || "Unknown error"
  );
  return false;
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
      if (validateStudy(rebuild)) {
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
    console.error(error);

    throw "Error: " + error;
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
