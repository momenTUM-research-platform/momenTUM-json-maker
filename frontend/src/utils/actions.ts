import toast from "react-hot-toast";
import Ajv, { DefinedError } from "ajv";
import { API_URL } from "../App";
import { schema } from "../../schema/schema";
import saveAs from "file-saver";
import { useStore } from "../state";

export async function validate(form: Study, s: typeof schema) {
  if (!form) {
    console.log("No form to validate");
    toast.error("Please fill the form first!");
    return;
  }
  const valid = isValidForm(form, schema);
  valid.valid ? toast.success("Form is valid!") : toast.error(valid.msg);
}
function isValidForm(form: Study, schema): { valid: boolean; msg: string } {
  const validator = new Ajv().compile(schema);
  const valid = validator(form);
  if (!valid) {
    const errors = validator.errors as DefinedError[];
    return {
      valid: false,
      msg:
        errors.reduce(
          (acc, e) => acc + e.keyword + " error: " + e.instancePath + " " + e.message + "\n",
          ""
        ) || "Unknown error",
    };
  } else {
    return { valid: true, msg: "Valid" };
  }
}

export function save() {
  const { study, modules, questions, sections } = useStore.getState();

  const fullStudy: Study = {
    ...study,
    modules: study.subNodes.map((module_id) => {
      return {
        ...modules[module_id],
        sections: modules[module_id].subNodes.map((section_id) => {
          return {
            ...sections[section_id],
            questions: sections[section_id].subNodes.map((question_id) => questions[question_id]),
          };
        }),
      };
    }),
  };

  const data = JSON.stringify(fullStudy, null, 2);
  const uri = "data:application/json;charset=utf-8," + encodeURIComponent(data);
  const link = document.createElement("a");
  link.href = uri;
  link.download = "form.json";
  link.click();
}

export function load(setStudy: (study: Study) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => {
    // @ts-ignore
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(reader.result as string);
      setStudy(data);
    };
    reader.readAsText(file);
  };
  input.click();
}

export async function upload(form: Study, schema: typeof schema) {
  console.log(schema.properties.modules.items.properties.unlock_after.items.enum);

  const { valid, msg } = isValidForm(form, schema);
  const proceed =
    valid || confirm("Form is not valid. Are you sure you want to upload it? \nError: " + msg);
  if (proceed) {
    const data = JSON.stringify(form, null, 2);
    const password = prompt(
      "Please enter the password to upload surveys. If you don't know it, ask constantin.goeldel@tum.de or read the .env file on the server"
    );
    const postURL = API_URL + "/study";
    const response = await fetch(postURL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: password || "MomenTUM",
      },
    });
    if (response.status === 200) {
      // @ts-ignore
      toast.success(
        "Uploaded survey!. Available at https://tuspl22-momentum.srv.mwn.de/api/v1/studies/" +
          form.properties.study_id,
        {
          duration: 20000,
        }
      );
    } else {
      // @ts-ignore
      toast.error("Error: " + response.statusText);
    }
  }
}

export async function download(setForm: (form: Study) => void, id?: string, commit?: string) {
  const uri =
    API_URL +
    "/study/" +
    (id || prompt("Enter the id of the study")) +
    (commit ? "/" + commit : "");
  if (!uri) {
    toast.error("No download link provided");
    return;
  }
  console.log(uri);

  const response = await fetch(uri);
  if (response.ok) {
    const data = await response.json();
    setForm(data);
  } else {
    toast.error("Download failed");
  }
}

export async function createProject(form: Study) {
  try {
    const response = await fetch(API_URL + "/create", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const json = await response.json();
    console.log(json);
    toast.success(json.message);
  } catch (err) {
    toast.error(err);
  }
}

export async function addApiKey() {
  try {
    const study_id = prompt("Enter the study id");
    const api_key = prompt("Enter the API key");

    const response = await fetch(API_URL + "/key", {
      method: "POST",
      body: JSON.stringify({ study_id, api_key }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    toast(text);
  } catch (err) {
    toast.error(String(err));
  }
}

export async function generateDictionary(form) {
  if (!form) return;
  try {
    const modules = form.modules;
    let csvString = `"Variable / Field Name","Form Name","Section Header","Field Type","Field Label","Choices, Calculations, OR Slider Labels","Field Note","Text Validation Type OR Show Slider Number","Text Validation Min","Text Validation Max",Identifier?,"Branching Logic (Show field only if...)","Required Field?","Custom Alignment","Question Number (surveys only)","Matrix Group Name","Matrix Ranking?","Field Annotation"\n`;
    for (const module of modules) {
      for (const section of module.sections) {
        for (const question of section.questions) {
          if (question.type === "instruction") continue;
          csvString += `${question.id},${module.id},,text,${question.text},,,,,,,,,,,,,\n`;
        }
      }
    }
    console.log(csvString);
    saveAs(new Blob([csvString]), "dictionary.csv");
  } catch (err) {
    console.error(err);
    toast.error("Generation failed");
  }
}
