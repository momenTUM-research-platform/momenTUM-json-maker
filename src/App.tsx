import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import Ajv, { DefinedError, ValidateFunction } from "ajv";
import "./App.css";
import { useEffect, useState } from "react";
import schema from "../schema.json";
import { Form } from "../types";
import ToC from "./ToC";
import styled from "styled-components";
// @ts-ignore
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://tuspl22-momentum.srv.mwn.de"
    : "http://localhost:3001";

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

const P = styled.p`
  margin-bottom: 10px;
  font-size: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  postion: sticky;
`;

function App() {
  const [form, setForm] = useState<Form | null>(null);
  const [valid, setValid] = useState(false);
  const [validator, setValidator] = useState<ValidateFunction | null>(new Ajv().compile(schema));

  const uiSchema = {
    title: { "ui:widget": "date" },
  };

  useEffect(() => {
    // if( form?.properties.study_name && !form?.properties.study_id ) { auto-generate study_id
    const valid = validator ? validator(form) : false;
    setValid(valid);
  }, [form]);

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

  async function upload() {
    if (valid) {
      const data = JSON.stringify(form, null, 2);
      const postURL = BASE_URL + "/surveys";
      const response = await fetch(postURL, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: "MomenTUM",
        },
      });
      const json = await response.json();
      console.log(json);
      if (json.status === "ok") {
        // @ts-ignore
        alert("Uploaded survey with id " + json.uuid + " to " + json.uri);
      } else {
        // @ts-ignore
        alert("Error: " + json.error);
      }
    } else {
      alert("Form is not valid");
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
      <P>The survey is currently {valid ? <> valid </> : <>Invalid</>}</P>

      <Button onClick={save}>Save JSON file</Button>
      <Button onClick={load}>Load JSON file</Button>
      <Button onClick={upload}>Upload JSON file</Button>
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
        onSubmit={(e) => upload()}
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
