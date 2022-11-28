import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import { JSONSchemaType } from "ajv";
import React, { useMemo } from "react";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { section } from "../schema/section";
import { State, useStore } from "./state";

export function Form({ id }: { id: string }) {
  const { atoms, setAtom } = useStore();
  const atom = atoms.get(id);

  if (!atom) {
    console.error("Atom " + id + " does not exist. This should never be the case!");
    return <></>;
  }

  let uiSchema = {
    title: { "ui:widget": "date" },
    "ui:submitButtonOptions": {
      norender: true,
    },
  };

  const hiddenFields = ["id", "study_id", "post_url"];
  hiddenFields.forEach((field) => (uiSchema[field] = { "ui:widget": "hidden" }));
  console.log(id);
  console.table(atom.content);

  return (
    <FormComponent
      onChange={({ formData }) => setAtom(id, formData)}
      schema={atom.schema}
      formData={atom.content}
      uiSchema={uiSchema}
      idPrefix="form"
    />
  );
}
