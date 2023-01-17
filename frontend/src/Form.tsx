import FormComponent from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { useMemo, useState } from "react";
import { module } from "../schema/module";
import { properties } from "../schema/properties";
import { question } from "../schema/question";
import { section } from "../schema/section";
import { study } from "../schema/study";
import { useStore } from "./state";

export function Form({ id }: { id: string }) {
  const { atoms, setAtom, conditions, saveAtoms, showHidingLogic, liveValidation } = useStore();
  const atom = atoms.get(id);
  const [questionIds, setQuestionIds] = useState<SchemaEnum[]>([]);
  const [moduleIds, setModuleIds] = useState<SchemaEnum[]>([]);

  useMemo(() => {
    const qIds: SchemaEnum[] = [{ id: "none", text: "None" }];
    const mIds: SchemaEnum[] = [];
    for (const [key, value] of atoms.entries()) {
      console.log(atom?.type);
      if (value.content._type === "question") {
        qIds.push({ id: key, text: value.content.text });
      }
      if (value.content._type === "module" && key !== id) {
        mIds.push({ id: key, text: value.content.name });
      }
    }
    setQuestionIds(qIds);
    setModuleIds(mIds);
  }, [atoms.size]);
  if (!atom) {
    console.error("Atom " + id + " does not exist. This should never be the case!");
    return <></>;
  }
  let uiSchema: { [key: string]: any } = {
    alerts: {
      random: {
        "ui:widget": "radio",
      },
      sticky: {
        "ui:widget": "radio",
      },
      timeout: {
        "ui:widget": "radio",
      },
    },
    graph: {
      display: {
        "ui:widget": "radio",
      },
      blurb: {
        "ui:widget": "textarea",
      },
    },
    shuffle: {
      "ui:widget": "radio",
    },
    "ui:submitButtonOptions": {
      norender: true,
    },
    cache: {
      "ui:widget": "radio",
    },
    support_email: {
      "ui:widget": "email",
    },
    instructions: {
      "ui:widget": "textarea",
    },
    required: {
      "ui:widget": "radio",
    },
    radio: {
      "ui:widget": "radio",
    },
    modal: {
      "ui:widget": "radio",
    },
    text: {
      "ui:widget": "textarea",
    },
    hide_if: {
      "ui:widget": "radio",
    },
  };

  const hiddenFields = ["id", "post_url"];
  const hidingLogic = ["hide_id", "hide_value", "hide_if", "rand_group"];
  hiddenFields.forEach((field) => (uiSchema[field] = { "ui:widget": "hidden" }));
  !showHidingLogic && hidingLogic.forEach((field) => (uiSchema[field] = { "ui:widget": "hidden" }));
  // Maps Atoms to JSON Schema
  const schema: { [key in AtomVariants]: () => Object } = {
    ["study"]: () => study,
    ["properties"]: () => properties,
    ["module"]: () => module(conditions, questionIds, moduleIds),
    ["section"]: () => section,
    ["question"]: () => question(questionIds),
  };

  return (
    <FormComponent
      onChange={({ formData }) => setAtom(id, formData)}
      onBlur={saveAtoms}
      children={true}
      liveValidate={liveValidation}
      schema={schema[atom.content._type]()}
      formData={atom.content}
      validator={validator}
      noValidate={!liveValidation}
      uiSchema={uiSchema}
      idPrefix="form"
      showErrorList="bottom"
    />
  );
}
