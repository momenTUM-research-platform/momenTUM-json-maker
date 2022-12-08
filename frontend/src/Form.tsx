import { MuiForm5 as FormComponent } from "@rjsf/material-ui";
import React from "react";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { section } from "../schema/section";
import { AtomVariants, useStore } from "./state";

export function Form({ id }: { id: string }) {
  const { atoms, setAtom, conditions, saveAtoms } = useStore();
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

  // Maps Atoms to JSON Schema
  const schema: { [key in AtomVariants]: () => Object } = {
    [AtomVariants.Study]: () => properties,
    [AtomVariants.Module]: () => module(conditions),
    [AtomVariants.Section]: () => section,
    [AtomVariants.Question]: () => question,
  };

  return (
    <FormComponent
      onChange={({ formData }) => setAtom(id, formData)}
      onBlur={saveAtoms}
      schema={schema[atom.content._type]()}
      formData={atom.content}
      uiSchema={uiSchema}
      idPrefix="form"
    />
  );
}
