import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import Ajv, { DefinedError } from "ajv";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Schema from "../schema.json";
import { Form } from "../types";
import { saveAs } from "file-saver";
import toast, { Toaster } from "react-hot-toast";

import ToC from "./ToC";
import "./App.css";
import React from "react";

const BASE_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";
const REDCAP_IMPORTER_URL =
  process.env.NODE_ENV === "production" ? "/redcap" : "http://localhost:5000/redcap";

const Container = styled.div`
  margin: 100px;
`;
const Button = styled.button`
  padding: 10px;
  background: #3070b3;
  color: white;
  border-radius: 5px;
  margin-right: 7px;
  margin-top: 3px;
  font-size: 1em;
  box-shadow: none;
  border: none;
  text-decoration: none;
`;

const Latest = styled.button`
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  background: #1c426b;
  color: white;
  border-radius: 5px;
  margin-right: 7px;
  margin-top: 3px;
  box-shadow: none;
  font-size: 1.2rem;
  border: none;
  text-decoration: none;
  margin-top: 10px;
`;

function App() {
  const [form, setForm] = useState<Form | null>(null);
  const [schema, setSchema] = useState(Schema);
  const [liveValidate, setLiveValidate] = useState(true);
  const [latest, setLatest] = useState<Form[] | null>(null);

  const uiSchema = {
    title: { "ui:widget": "date" },
  };

  useEffect(() => {
    if (!form) return;
    let schemaCopy = schema;

    schemaCopy.properties.modules.items.properties.condition.enum = [
      "Select one of the properties below",
      "*",
      ...form?.properties.conditions,
    ];
    const moduleIds = new Set(form.modules.map((module) => module.uuid));
    schemaCopy.properties.modules.items.properties.unlock_after.items.enum =
      moduleIds.size > 0 ? Array.from(moduleIds) : [""];
    setSchema({ ...schemaCopy });
  }, [form]);

  useEffect(() => {}, [schema]);

  useEffect(() => {
    fetch(BASE_URL + "/latest")
      .then((res) => res.json())
      .then((data) => setLatest(data.studies))
      .catch((err) => toast.error("Download latest studies failed: " + String(err)));
  }, []);

  // Validation is computationally expensive, but only done on submit/uplaod
  function isValidForm(form: Form): { valid: boolean; msg: string } {
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

  function validate() {
    if (!form) {
      console.log("No form to validate");
      toast.error("Please fill the form first!");
      return;
    }
    const valid = isValidForm(form);
    valid.valid ? toast.success("Form is valid!") : toast.error(valid.msg);
  }

  function save() {
    const data = JSON.stringify(form, null, 2);
    const uri = "data:application/json;charset=utf-8," + encodeURIComponent(data);
    const link = document.createElement("a");
    link.href = uri;
    link.download = "form.json";
    link.click();
  }

  function load() {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      // @ts-ignore
      const file = e.target.files![0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(reader.result as string);
        setForm(data);
      };
      reader.readAsText(file);
    };
    input.click();
  }

  async function upload(form: Form) {
    console.log(schema.properties.modules.items.properties.unlock_after.items.enum);

    const { valid, msg } = isValidForm(form);
    const proceed =
      valid || confirm("Form is not valid. Are you sure you want to upload it? \nError: " + msg);
    if (proceed) {
      const data = JSON.stringify(form, null, 2);
      const password = prompt(
        "Please enter the password to upload surveys. If you don't know it, ask constantin.goeldel@tum.de or read the .env file on the server"
      );
      const postURL = BASE_URL + "/surveys";
      const response = await fetch(postURL, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: password || "MomenTUM",
        },
      });
      const json = await response.json();
      console.log(json);
      if (json.status === "ok") {
        // @ts-ignore
        toast.success("Uploaded survey with id " + json.uuid + " to \n " + json.uri, {
          duration: 20000,
        });
      } else {
        // @ts-ignore
        toast.error("Error: " + json.message);
      }
    }
  }

  async function download() {
    const uri = BASE_URL + "/surveys/" + prompt("Enter the uuid of the survey");
    if (!uri) {
      toast.error("No download link provided");
      return;
    }
    const response = await fetch(uri);
    if (response.ok) {
      const data = await response.json();
      setForm(data);
    } else {
      toast.error("Download failed");
    }
  }
  // async function downloadDictionary() {
  //   try {
  //     console.log(form);
  //     const uuid = form?.uuid ? form.uuid : prompt("Enter the uuid of the survey");
  //     if (!uuid) {
  //       toast.error("No download uuid provided");
  //       return;
  //     }
  //     const uri = BASE_URL + "/dictionary/" + uuid + "?regenerate=true";
  //     await fetch(uri, { method: "GET", redirect: "follow" });
  //   } catch (e) {
  //     console.error(e);
  //     toast.error("Download failed");
  //   }
  //

  async function createProject() {
    try {
      const response = await fetch(REDCAP_IMPORTER_URL + "/create", {
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

  async function addApiKey() {
    try {
      const study_id = prompt("Enter the study id");
      const api_key = prompt("Enter the API key");

      const response = await fetch(REDCAP_IMPORTER_URL + "/add", {
        method: "POST",
        body: JSON.stringify({ study_id, api_key }),
      });
      const json = await response.json();
      console.log(json);
      toast(json.message);
    } catch (err) {
      toast.error(String(err));
    }
  }

  async function generateDictionary() {
    if (!form) return;
    try {
      const modules = form.modules;
      let csvString = `"Variable / Field Name","Form Name","Section Header","Field Type","Field Label","Choices, Calculations, OR Slider Labels","Field Note","Text Validation Type OR Show Slider Number","Text Validation Min","Text Validation Max",Identifier?,"Branching Logic (Show field only if...)","Required Field?","Custom Alignment","Question Number (surveys only)","Matrix Group Name","Matrix Ranking?","Field Annotation"\n`;
      for (const module of modules) {
        for (const section of module.sections) {
          for (const question of section.questions) {
            if (question.type === "instruction") continue;
            csvString += `${question.id},${module.uuid},,text,${question.text},,,,,,,,,,,,,\n`;
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
  return (
    <Container>
      <h1>Welcome to the MomenTUM Survey Generator!</h1>

      <Button onClick={save}>Save JSON file</Button>
      <Button onClick={load}>Load JSON file</Button>
      <Button onClick={() => form && upload(form)}>Upload JSON file</Button>
      <Button onClick={download}>Download JSON file</Button>
      <Button onClick={generateDictionary}>Generate RedCap Dictionary</Button>
      <Button onClick={createProject}>Create project in RedCap</Button>
      <Button onClick={addApiKey}>Add API key</Button>
      <Button onClick={validate}>Validate</Button>
      <Button>
        <a className="github" href="https://github.com/TUMChronobiology/momenTUM-json-maker">
          Github
        </a>{" "}
      </Button>
      <br />
      {latest &&
        latest.map((study) => (
          <Latest onClick={() => setForm(study)}>
            <p style={{ margin: "5px 10px 0px 10px" }}>{study.properties.study_name}</p>
            <p style={{ fontSize: "0.7rem", margin: "0px 10px 5px 10px" }}>
              {study.properties.study_id}
            </p>
          </Latest>
        ))}
      <br />
      <br />
      <input
        id="validate"
        onClick={() => setLiveValidate((s) => !s)}
        defaultChecked
        type="checkbox"
      />
      <label htmlFor="validate"> Live Validation?</label>

      <br />
      {form && <ToC form={form} />}

      <FormComponent
        onChange={({ formData }: { formData: Form }) => setForm(formData)}
        onSubmit={(e) => form && upload(form)}
        noValidate={!liveValidate}
        //@ts-ignore
        schema={schema}
        formData={form}
        uiSchema={uiSchema}
        liveValidate={liveValidate}
        idPrefix="form"
      />
      <Toaster />
    </Container>
  );
}

export default App;
