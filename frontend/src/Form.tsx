import FormComponent from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { useMemo, useState } from "react";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { section } from "../schema/section";
import { useStore } from "./state";

export function Form({ id }: { id: string }) {
  const { atoms, setAtom, conditions, saveAtoms } = useStore();
  const atom = atoms.get(id);
  const [questionIds, setQuestionIds] = useState<QuestionEnum[]>([]);

  useMemo(() => {
    const ids: QuestionEnum[] = [{ id: "none", text: "None" }];
    for (const [key, value] of atoms.entries()) {
      console.log(atom?.type);
      if (value.content._type === "question") {
        ids.push({ id: key, text: value.content.text });
      }
    }
    setQuestionIds(ids);
  }, [atoms]);
  if (!atom) {
    console.error("Atom " + id + " does not exist. This should never be the case!");
    return <></>;
  }

  let uiSchema: { [key: string]: any } = {
    title: { "ui:widget": "date" },
    "ui:submitButtonOptions": {
      norender: true,
    },
  };

  const hiddenFields = ["id", "study_id", "post_url"];
  hiddenFields.forEach((field) => (uiSchema[field] = { "ui:widget": "hidden" }));

  // Maps Atoms to JSON Schema
  const schema: { [key in AtomVariants]: () => Object } = {
    ["study"]: () => properties,
    ["module"]: () => module(conditions),
    ["section"]: () => section,
    ["question"]: () => question(questionIds),
  };

  return (
    <FormComponent
      onChange={({ formData }) => setAtom(id, formData)}
      onBlur={saveAtoms}
      children={true}
      liveValidate={true}
      schema={schema[atom.content._type]()}
      formData={atom.content}
      validator={validator}
      uiSchema={uiSchema}
      idPrefix="form"
    />
  );
}
