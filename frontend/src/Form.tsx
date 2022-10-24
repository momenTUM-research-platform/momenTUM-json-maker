import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import React from "react";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { section } from "../schema/section";
import { useStore } from "./state";
import { upload } from "./utils/actions";

export function Form() {
  const store = useStore();
  const id = store.selectedNode;

  if (!id) {
    return (
      <div className="flex place-content-center h-full">
        <p className="text-center self-center">Select node to start editing</p>
      </div>
    );
  }

  const schema = () => {
    if (store.modules[id]) return module;
    if (store.sections[id]) return section;
    if (store.questions[id]) return question;
    return properties;
  };

  const form = store.modules[id] || store.sections[id] || store.questions[id] || store.study;

  const uiSchema = {
    "ui:submitButtonOptions": {
      norender: true,
    },
    title: { "ui:widget": "date" },
  };
  return (
    <FormComponent
      // onChange={({ formData }) => store.(formData)}
      // onSubmit={(e) => study && upload(study, schema)}
      //@ts-ignore
      schema={schema()}
      formData={form}
      uiSchema={uiSchema}
      idPrefix="form"
    />
  );
}
