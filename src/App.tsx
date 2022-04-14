import Form from "@rjsf/chakra-ui";
import styled from "styled-components";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import Ajv, { DefinedError, ValidateFunction } from "ajv";
import "./App.css";
import { useEffect, useState } from "react";
import schema from "../schema.json";

interface Form {
  properties: {
    study_id: string;
    study_name: string;
    instructions: string;
    banner_url: string;
    support_email: string;
    support_url: string;
    ethics: string;
    pls: string;
    empty_message: string;
    post_url: string;
    conditions: string[];
    cache: boolean;
  };
  modules: {
    type: string;
    name: string;
    submit_text: string;
    condition: string;
    alerts: {
      title: string;
      message: string;
      start_offset: number;
      duration: number;
      times: {
        hours: number;
        minutes: number;
      }[];
      random: boolean;
      random_interval: number;
      sticky: boolean;
      sticky_label: string;
      timeout: boolean;
      timeout_after: number;
    };
    graph: {
      display: boolean;
      variable: string;
      title: string;
      blurb: string;
      type: "bar" | "line";
      max_points: number;
    };
    sections: {
      name: string;
      shuffle: boolean;
      questions:
        | (Question & { type: "text"; subtype: string })
        | (Question & { type: "datetime"; subtype: string })
        | (Question & { type: "yesno"; yes_text: string; no_text: string })
        | (Question & {
            type: "slider";
            min: number;
            max: number;
            hint_left: string;
            hint_right: string;
          })
        | (Question & {
            type: "multi";
            radio: boolean;
            modal: boolean;
            options: string[];
            shuffle: boolean;
          })
        | (Question & {
            type: "media";
            subtype: "image" | "video" | "audio";
            src: string;
            thumb: string;
          });
    }[];
  }[];
  uuid: string;
  unlock_after: string[];
  shuffle: boolean;
}

interface Question {
  id: string;
  text: string;
  required: boolean;
  hide_id: string;
  hide_value: string | boolean;
  hide_if: boolean;
  rand_group: string;
}

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

  function download() {
    const data = JSON.stringify(form, null, 2);
    const uri =
      "data:application/json;charset=utf-8," + encodeURIComponent(data);
    const link = document.createElement("a");
    link.href = uri;
    link.download = "form.json";
    link.click();
  }

  return (
    <Container>
      <Button onClick={download}>Download JSON file</Button>
      <Button>
        <a href="https://github.com/TUMChronobiology/momenTUM-json-maker">
          Github
        </a>{" "}
      </Button>
      <Toolbar>
        {" "}
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
        {!valid && <P>{JSON.stringify(invalidReason)}</P>}
      </Toolbar>

      <Form
        onChange={({ formData }: { formData: Form }) => setForm(formData)}
        schema={schema as unknown as JSONSchema7 }
        formData={form}
        uiSchema={uiSchema}
        liveValidate={true}
        idPrefix="form"
      />
    </Container>
  );
}

export default App;
