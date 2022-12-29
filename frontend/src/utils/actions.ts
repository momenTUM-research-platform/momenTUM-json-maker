import toast from "react-hot-toast";
import { API_URL } from "../App";
import { useStore } from "../state";
import { DefinedError } from "ajv";
import { constructStudy } from "./construct";
import { deconstructStudy } from "./deconstruct";

// export async function validate(form: Study, s: typeof schema) {
//   if (!form) {
//     console.log("No form to validate");
//     toast.error("Please fill the form first!");
//     return;
//   }
//   const valid = isValidForm(form, schema);
//   valid.valid ? toast.success("Form is valid!") : toast.error(valid.msg);
// }

// }

export function validateStudy(study: Study): study is Study {
  const { validator } = useStore.getState();
  console.log(study);
  const valid = validator(study);
  if (valid) return true;
  const errors = validator.errors as DefinedError[];
  console.error(errors);

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
      if (validateStudy(data)) {
        const atoms = deconstructStudy(data);
        setAtoms(atoms);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export async function upload(study: Study): Promise<string> {
  const data = JSON.stringify(study, null, 2);
  const postURL = API_URL + "/study";
  const response = await fetch(postURL, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: "MomenTUM",
    },
  });
  const body = await response.text();
  if (body.includes("ObjectId(")) {
    // Success
    return body.slice(9, -2); // ID of the uploaded study
    // toast.success(
    //   "Uploaded survey!. Available at https://tuspl22-momentum.srv.mwn.de/api/v1/studies/" +
    //     study.properties.study_id,
    //   {
    //     duration: 20000,
    //   }
    // );
  } else {
    console.log(body)
    throw new Error(body);
  }
}

export async function download() {
  const { setAtoms } = useStore.getState();
  const uri = API_URL + "/studies/" + prompt("Enter the id of the study");
  if (!uri) {
    toast.error("No download link provided");
    return;
  }
  console.log(uri);

  const response = await fetch(uri);
  if (response.ok) {
    const data = await response.json();
    if (validateStudy(data)) {
      const atoms = deconstructStudy(data);
      setAtoms(atoms);
    }
  } else {
    toast.error("Download failed");
  }
}

// export async function createProject(form: Study) {
//   try {
//     const response = await fetch(API_URL + "/create", {
//       method: "POST",
//       body: JSON.stringify(form),
//     });
//     const json = await response.json();
//     console.log(json);
//     toast.success(json.message);
//   } catch (err) {
//     toast.error(err);
//   }
// }

// export async function addApiKey() {
//   try {
//     const study_id = prompt("Enter the study id");
//     const api_key = prompt("Enter the API key");

//     const response = await fetch(API_URL + "/key", {
//       method: "POST",
//       body: JSON.stringify({ study_id, api_key }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const text = await response.text();
//     toast(text);
//   } catch (err) {
//     toast.error(String(err));
//   }
// }

export async function saveDictionary() {
  const { atoms } = useStore.getState();
  const study = constructStudy(atoms);
  const dictionary = generateDictionary(study);
  const uri = "data:application/json;charset=utf-8," + encodeURIComponent(dictionary);
  const link = document.createElement("a");
  link.href = uri;
  link.download = "dictionary.csv";
  link.click();
}

export function generateDictionary(study: Study): string {
  const modules = study.modules;
  let dictionary = `"Variable / Field Name","Form Name","Section Header","Field Type","Field Label","Choices, Calculations, OR Slider Labels","Field Note","Text Validation Type OR Show Slider Number","Text Validation Min","Text Validation Max",Identifier?,"Branching Logic (Show field only if...)","Required Field?","Custom Alignment","Question Number (surveys only)","Matrix Group Name","Matrix Ranking?","Field Annotation"\n`;
  for (const module of modules) {
    for (const section of module.sections) {
      for (const question of section.questions) {
        if (question.type === "instruction") continue;
        dictionary += `${question.id},${module.id},,text,${question.text},,,,,,,,,,,,,\n`;
      }
    }
  }
  return dictionary;
}
