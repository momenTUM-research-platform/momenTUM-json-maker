import FormComponent from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { RJSFSchema } from "@rjsf/utils";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { section } from "../schema/section";
import { useStore } from "./state";

export function Form({ id }: { id: string }) {
  const { atoms, setAtom, conditions, saveAtoms } = useStore();
  const atom = atoms.get(id);

  if (!atom) {
    console.error("Atom " + id + " does not exist. This should never be the case!");
    return <></>;
  }

  // let uiSchema: { [key: string]: any } = {
  //   title: { "ui:widget": "date" },
  //   "ui:submitButtonOptions": {
  //     norender: true,
  //   },
  // };

  // const hiddenFields = ["id", "study_id", "post_url"];
  // hiddenFields.forEach((field) => (uiSchema[field] = { "ui:widget": "hidden" }));

  // Maps Atoms to JSON Schema
  const schema: { [key in AtomVariants]: () => Object } = {
    ["study"]: () => properties,
    ["module"]: () => module(conditions),
    ["section"]: () => section,
    ["question"]: () => question,
  };

  return (
    <FormComponent
      onChange={({ formData }) => setAtom(id, formData)}
      onBlur={saveAtoms}
      schema={schema[atom.content._type]()}
      formData={atom.content}
      validator={validator}
      // uiSchema={uiSchema}
      idPrefix="form"
    />
  );
}
