import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import Ajv, { DefinedError } from "ajv";
import { useState } from "react";
import styled from "styled-components";
import schema from "../schema.json";
import { Form } from "../types";

import ToC from "./ToC";
import "./App.css";

const BASE_URL =
  process.env.NODE_ENV === "production" ? "http://localhost:3000" : "http://localhost:3001";

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

function App() {
  const [form, setForm] = useState<Form | null>(null);

  const uiSchema = {
    title: { "ui:widget": "date" },
  };

  // Validation is computationally expensive, but only done on submit/uplaod
  function isValidForm(form: Form): { valid: boolean; msg: string } {
    const validator = new Ajv().compile(schema);
    const valid = validator(form);
    if (!valid) {
      const errors = validator.errors as DefinedError[];
      return { valid: false, msg: errors[0].message || "Unknown error" };
    } else {
      return { valid: true, msg: "Valid" };
    }
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
    const { valid, msg } = isValidForm(form);
    if (valid) {
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
        alert("Uploaded survey with id " + json.uuid + " to " + json.uri);
      } else {
        // @ts-ignore
        alert("Error: " + json.message);
      }
    } else {
      alert("Form is not valid. Error: " + msg);
    }
  }

  async function download() {
    const uri = BASE_URL + "/surveys/" + prompt("Enter the uuid of the survey");
    if (!uri) {
      alert("No download link provided");
      return;
    }
    const response = await fetch(uri);
    if (response.ok) {
      const data = await response.json();
      setForm(data);
    } else {
      alert("Download failed");
    }
  }

  return (
    <Container>
      <h1>Welcome to the MomenTUM Survey Generator!</h1>

      <Button onClick={save}>Save JSON file</Button>
      <Button onClick={load}>Load JSON file</Button>
      <Button onClick={() => form && upload(form)}>Upload JSON file</Button>
      <Button onClick={download}>Download JSON file</Button>
      <Button>
        <a className="github" href="https://github.com/TUMChronobiology/momenTUM-json-maker">
          Github
        </a>{" "}
      </Button>
      <br />
      {form && <ToC form={form} />}
      {/*
 // @ts-ignore */}
      <FormComponent
        onChange={({ formData }: { formData: Form }) => setForm(formData)}
        onSubmit={(e) => form && upload(form)}
        //@ts-ignore
        schema={schema}
        formData={form}
        uiSchema={uiSchema}
        liveValidate={true}
        idPrefix="form"
      />
    </Container>
  );
}

export default App;
