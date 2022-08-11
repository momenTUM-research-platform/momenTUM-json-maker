import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Schema from "../schema.json";
import { Form } from "../types";
import toast, { Toaster } from "react-hot-toast";
import { addApiKey, download, generateDictionary, load, save, upload, validate } from "./tools";
import ToC from "./ToC";
import "./App.css";
import React from "react";
import Commit from "./Commit";

export const API_URL =
  process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:8000/api/v1";

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
  const [liveValidate, setLiveValidate] = useState(false);
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
    // const moduleIds = form.modules.map((module) => module.uuid);
    const moduleIds = Array.from(new Set(form.modules.map((module) => module.uuid)));

    schemaCopy.properties.modules.items.properties.unlock_after.items.enum =
      //    moduleIds.size > 0 ? Array.from(moduleIds) : [""];
      moduleIds.length > 0 ? moduleIds : [""];
    setSchema({ ...schemaCopy });
  }, [form]);

  useEffect(() => {
    fetch(API_URL + "/studies")
      .then((res) => res.json())
      .then((data) => setLatest(data))
      .catch((err) => toast.error("Download latest studies failed: " + String(err)));
  }, []);

  // Validation is computationally expensive, but only done on submit/uplaod

  return (
    <Container>
      <h1>Welcome to the MomenTUM Survey Generator!</h1>
      <Button onClick={() => save(form)}>Save JSON file</Button>
      <Button onClick={() => load(setForm)}>Load JSON file</Button>
      <Button onClick={() => form && upload(form, schema)}>Upload JSON file</Button>
      <Button onClick={() => download(setForm)}>Download JSON file</Button>
      <Button onClick={generateDictionary}>Generate RedCap Dictionary</Button>
      {/* <Button onClick={createProject}>Create project in RedCap</Button> */}
      <Button onClick={addApiKey}>Add API key</Button>
      <Button onClick={() => form && validate(form, schema)}>Validate</Button>
      <Button>
        <a className="github" href="https://github.com/TUMChronobiology/studies">
          Github
        </a>{" "}
      </Button>
      <br />
      {latest &&
        latest.map((study) => (
          <Latest
            key={study.properties.study_id + study.metadata.commits[0].id}
            onClick={() => setForm(study)}
          >
            <p style={{ margin: "5px 10px 0px 10px" }}>{study.properties.study_name}</p>
            <p style={{ fontSize: "0.7rem", margin: "0px 10px 5px 10px" }}>
              {study.properties.study_id}
            </p>
          </Latest>
        ))}

      <br />
      <br />

      {form && form.metadata && (
        <>
          <p>
            This protocol has been saved {form.metadata.commits.length} times. Select a specific
            commit by clicking on the button below.
          </p>

          {form.metadata.commits.map((commit) => (
            <Commit
              key={commit.id}
              setForm={setForm}
              id={form.properties.study_id}
              hash={commit.id}
              timestamp={commit.timestamp}
            />
          ))}
          <p>
            <a href={`${form.metadata.url}/${form.metadata.commits[0].id}`}>Permanent Link</a>
          </p>
        </>
      )}
      <input id="validate" onClick={() => setLiveValidate((s) => !s)} type="checkbox" />
      <label htmlFor="validate"> Live Validation?</label>
      <br />
      {form && <ToC form={form} />}
      <FormComponent
        onChange={({ formData }: { formData: Form }) => setForm(formData)}
        onSubmit={(e) => form && upload(form, schema)}
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
