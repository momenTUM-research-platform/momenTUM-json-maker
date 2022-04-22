import FormComponent from "@rjsf/chakra-ui";
import styled from "styled-components";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import Ajv, { DefinedError, ValidateFunction } from "ajv";
import "./App.css";
import { useEffect, useState } from "react";
import schema from "../schema.json";
import { Form } from "../types";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://tuspl22-momentum.srv.mwn.de"
    : "http://localhost:3000";

const Container = styled.div`
  margin: 100px;
`;
const Button = styled.button`
  padding: 10px;
  background: #3070b3;
  color: white;
  border-radius: 5px;
  margin-right: 5px;
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
  const [invalidReason, setInvalidReason] = useState<DefinedError | null>(null);
  const [validator, setValidator] = useState<ValidateFunction | null>();

  const uiSchema = {
    title: { "ui:widget": "hidden" },
  };
  useEffect(() => {
    // if( form?.properties.study_name && !form?.properties.study_id ) { auto-generate study_id

    const validate = validator ? validator : new Ajv().compile(schema);
    validator || setValidator(validate);
    const valid = validate(form);

    setValid(valid);
    setInvalidReason(null);
    if (!valid) {
      setInvalidReason(validate.errors![0] as DefinedError);
    }
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
    const data = JSON.stringify(form, null, 2);
    const postURL = BASE_URL + "/surveys";
    const response = await fetch(postURL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);
    if (json.status === "ok") {
      // @ts-ignore
      alert("Uploaded survey with id " + json.uuid + " to " + json.uri);
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
      <P>
        The survey is currently{" "}
        {valid ? (
          <>
            {" "}
            <CheckCircleIcon /> valid{" "}
          </>
        ) : (
          <>
            <WarningIcon /> Invalid
          </>
        )}
      </P>

      <Button onClick={save}>Save JSON file</Button>
      <Button onClick={load}>Load JSON file</Button>
      <Button onClick={upload}>Upload JSON file</Button>
      <Button onClick={download}>Download JSON file</Button>
      <Button>
        <a href="https://github.com/TUMChronobiology/momenTUM-json-maker">Github</a>{" "}
      </Button>
      <br />
      <FormComponent
        onChange={({ formData }: { formData: Form }) => setForm(formData)}
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
