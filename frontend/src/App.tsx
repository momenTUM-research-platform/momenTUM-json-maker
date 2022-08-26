import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Schema from "../schema.json";
import { Study } from "../types";
import toast, { Toaster } from "react-hot-toast";
import { addApiKey, download, generateDictionary, load, save, upload, validate } from "./tools";
import ToC from "./ToC";
import "./App.css";
import React from "react";
import Commit from "./Commit";
import QR from "qrcode";

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
  const [study, setStudy] = useState<Study | null>(null);
  const [schema, setSchema] = useState(Schema);
  const [liveValidate, setLiveValidate] = useState(false);
  const [studies, setStudies] = useState<{ [key: string]: Study } | null>(null);

  const uiSchema = {
    title: { "ui:widget": "date" },
  };

  useEffect(() => {
    if (!study || !studies) return;
    let schemaCopy = schema;
    schemaCopy.properties.modules.items.properties.condition.enum = [
      "Select one of the properties below",
      "*",
      ...study?.properties.conditions,
    ];
    // const moduleIds = form.modules.map((module) => module.uuid);
    const moduleIds = Array.from(new Set(study?.modules.map((module) => module.uuid)));

    schemaCopy.properties.modules.items.properties.unlock_after.items.enum =
      //    moduleIds.size > 0 ? Array.from(moduleIds) : [""];
      moduleIds.length > 0 ? moduleIds : [""];
    setSchema({ ...schemaCopy });
  }, [study]);

  useEffect(() => {
    fetch(API_URL + "/studies")
      .then((res) => res.json())
      .then((data) => setStudies(data))
      .catch((err) => toast.error("Download latest studies failed: " + String(err)));
  }, []);

  return (
    <Container>
      <h1>Welcome to the MomenTUM Survey Generator!</h1>
      <Button onClick={() => save(study)}>Save JSON file</Button>
      <Button onClick={() => load(setStudy)}>Load JSON file</Button>
      <Button onClick={() => study && upload(study, schema)}>Upload JSON file</Button>
      <Button onClick={() => download(setStudy)}>Download JSON file</Button>
      <Button onClick={generateDictionary}>Generate RedCap Dictionary</Button>
      {/* <Button onClick={createProject}>Create project in RedCap</Button> */}
      <Button onClick={addApiKey}>Add API key</Button>
      <Button onClick={() => study && validate(study, schema)}>Validate</Button>
      <Button>
        <a className="github" href="https://github.com/TUMChronobiology/studies">
          Github
        </a>{" "}
      </Button>
      <br />
      {studies &&
        Object.entries(studies)
          .filter(([key]) => key.includes("LATEST"))
          .map(([key, study]) => (
            <Latest key={key} onClick={() => setStudy(study)}>
              <p style={{ margin: "5px 10px 0px 10px" }}>{study.properties.study_name}</p>
              <p style={{ fontSize: "0.7rem", margin: "0px 10px 5px 10px" }}>
                {study.properties.study_id}
              </p>
            </Latest>
          ))}

      <br />
      <br />

      {study && studies && study.metadata && (
        <>
          <p>
            This protocol has been saved {study.metadata.commits.length} times. Select a specific
            commit by clicking on the button below.
          </p>

          {study.metadata.commits.map((commit) => (
            <Commit
              onClick={() =>
                setStudy(
                  Object.entries(studies).find(
                    ([k, s]) => (k = study.properties.study_id + ":" + commit.id)
                  )?.[1] || null
                )
              }
              key={commit.id}
              hash={commit.id}
              timestamp={commit.timestamp}
            />
          ))}
          <ul>
            <li>
              <a href={`${study.metadata.url}/${study.metadata.commits[0].id}`}>Permanent Link</a>{" "}
            </li>
            <li>
              <a
                onClick={async () => {
                  let code = await QR.toDataURL(
                    `${study.metadata.url}/${study.metadata.commits[0].id}`
                  );
                  window.open(code);
                }}
              >
                QR-Code
              </a>
            </li>
          </ul>
        </>
      )}
      <input id="validate" onClick={() => setLiveValidate((s) => !s)} type="checkbox" />
      <label htmlFor="validate"> Live Validation?</label>
      <br />
      {study && <ToC form={study} />}
      <FormComponent
        onChange={({ formData }: { formData: Study }) => setStudy(formData)}
        onSubmit={(e) => study && upload(study, schema)}
        noValidate={!liveValidate}
        //@ts-ignore
        schema={schema}
        formData={study}
        uiSchema={uiSchema}
        liveValidate={liveValidate}
        idPrefix="form"
      />
      <Toaster />
    </Container>
  );
}

export default App;
