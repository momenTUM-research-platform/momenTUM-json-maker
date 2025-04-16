// actions.ts
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
import { generateOdmXml } from "../utils/odmExport"; // <-- ODM import

export function validate() {
  const { atoms } = useStore.getState();
  const study = constructStudy(atoms);
  const { true_conditions, qIds, mIds } = getStudyCQMFromAtom(study);
  try {
    validateEachNode(atoms, true_conditions, qIds, mIds);
    if (validateStudy(study)) {
      toast.success("Study is valid");
    }
  } catch (err: any) {
    console.error("[validate] Validation error:", err);
    return false;
  }
}

export function save() {
  const { atoms } = useStore.getState();
  const study = constructStudy(atoms);
  // Log the study object for debugging
  console.debug("[save] Constructed study JSON:", study);
  const data = JSON.stringify(study, null, 2);
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
      try {
        const data = JSON.parse(reader.result as string);
        console.debug("[load] Loaded study data:", data);
        const deconstructed = deconstructStudy(data);
        const rebuild = constructStudy(deconstructed);
        if (validateStudyFromObj(rebuild)) {
          setAtoms(deconstructed);
          toast.success("Loaded Successfully!");
        } else {
          toast.error("Error while loading study!");
        }
      } catch (error) {
        console.error("[load] Parsing error:", error);
        toast.error("Invalid file format.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

export async function upload(study: any): Promise<string> {
  const data = JSON.stringify(study, null, 2);
  const postURL = API_URL + "/study";
  console.debug("[upload] Post URL:", postURL);
  console.debug("[upload] Study payload:", data);
  try {
    const response = await fetch(postURL, {
      method: "POST",
      body: data,
      redirect: "follow",
    });
    const body = await response.text();
    
    try {
      // Try parsing the response as JSON
      const parsed = JSON.parse(body);
      // If the JSON contains a permalink property, return the JSON string
      if (parsed && parsed.permalink) {
        return JSON.stringify(parsed);
      } else {
        throw body;
      }
    } catch (jsonError) {
      // Fallback for legacy response format:
      if (body.includes("ObjectId(")) {
        return body.slice(10, -2); // Legacy: extract the inserted ID
      } else {
        throw body;
      }
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
    console.error("[upload] Error:", errorKind);
    throw `Error: ${errorKind}`;
  }
}
export async function download(study_id: string): Promise<any> {
  const uri = API_URL + "/studies/" + study_id;
  console.debug("[download] Fetching study from:", uri);
  try {
    const response = await fetch(uri);
    if (response.ok) {
      return await response.json();
    } else {
      throw "Status: " + response.statusText + " " + (await response.text());
    }
  } catch (error) {
    console.error("[download] Error:", error);
    throw "Error: " + error;
  }
}

export async function createRedcapProject(username: string, study: any) {
  const uri = API_URL + "/redcap/" + username;
  console.debug("[createRedcapProject] URL:", uri);
  console.debug("[createRedcapProject] Study payload:", study);
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(study),
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      return await response.text();
    } else {
      throw "Status: " + response.statusText + " " + (await response.text());
    }
  } catch (error) {
    console.error("[createRedcapProject] Error:", error);
    throw "Error: " + error;
  }
}

export function getStudyCQMFromAtom(study: any): {
  true_conditions: string[];
  qIds: any[];
  mIds: any[];
} {
  const { atoms } = useStore.getState();
  const qIds: any[] = [{ id: "none", text: "None" }];
  const mIds: any[] = [];
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
    console.error("[getStudyCQMFromAtom] Conditions error:", err);
    toast.error("Conditions error: " + err.message);
    return { true_conditions: [], qIds: qIds, mIds: mIds };
  }
  return { true_conditions, qIds, mIds };
}

// --- Updated REDCap manual export (frontend-only) ---
export function saveRedcapFileForManual(): void {
  const { atoms } = useStore.getState();
  const study = constructStudy(atoms);
  console.debug("[saveRedcapFileForManual] Constructed study object:", study);

  try {
    const odmXml = generateOdmXml(study);
    console.debug("[saveRedcapFileForManual] Generated ODM XML:", odmXml);
    const blob = new Blob([odmXml], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // Use study.properties.study_id to name the file, if defined
    link.download = study.properties.study_id
      ? `${study.properties.study_id}.xml`
      : "study.xml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("ODM file downloaded!");
  } catch (error) {
    console.error("[saveRedcapFileForManual] Failed to generate ODM:", error);
    toast.error("Failed to generate ODM file.");
  }
}