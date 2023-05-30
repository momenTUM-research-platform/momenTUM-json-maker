import FormComponent from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { useMemo, useState } from "react";
import { useStore } from "../state";
import { properties } from "../../schema/properties";
import { section } from "../../schema/section";
import { question } from "../../schema/question";
import { module } from "../../schema/module";
import { alerts } from "../../schema/alerts";
import { params } from "../../schema/params";
import { paramsPVT } from "../../schema/paramsPVT";
import { paramsSurvey } from "../../schema/paramsSurvey";
import { propertiesSchema } from "./uischema/properties";
import TextFieldWidget from "./uischema/components/TextFieldWidget";
import { withTheme } from "@rjsf/core";
import Theme from "@rjsf/mui";
import TitleWidget from "./uischema/components/TitleWidget";
import DescriptionWidget from "./uischema/components/DescriptionWidget";
import { modulesSchema } from "./uischema/modules";
import { surveySchema } from "./uischema/survey";
import { ParamsPVtSchema } from './uischema/paramsPVT';

export function Form({ id }: { id: string }) {
  const {
    atoms,
    setAtom,
    conditions,
    saveAtoms,
    showHidingLogic,
    liveValidation,
    editableIds,
  } = useStore();
  const atom = atoms.get(id);
  const [questionIds, setQuestionIds] = useState<SchemaEnum[]>([]);
  const [moduleIds, setModuleIds] = useState<SchemaEnum[]>([]);

  useMemo(() => {
    const qIds: SchemaEnum[] = [{ id: "none", text: "None" }];
    const mIds: SchemaEnum[] = [];
    for (const [key, value] of atoms.entries()) {
      if (value.content._type === "question") {
        qIds.push({ id: key, text: value.content.text });
      } else if (value.content._type === "module" && key !== id) {
        mIds.push({ id: key, text: value.content.name });
      }
    }
    setQuestionIds(qIds);
    setModuleIds(mIds);
  }, [atoms.size]);

  if (!atom) {
    console.error(
      "Atom " + id + " does not exist. This should never be the case!"
    );
    return <></>;
  }

  const studyForm = () => ({
    $id: "#",
    type: "object",
    title: "Study",
    description:
      "This is the entrypoint to the Study Designer. Please start by clicking on properties or on the green '+' symbol",
  });

  const paramsForm = () => {
    if (atom.content._type === "params" && atom.content.type === "survey") {
      return paramsSurvey(questionIds);
    } else {
      return paramsPVT;
    }
  };

  const schema: { [key in AtomVariants]: () => Object } = {
    study: studyForm,
    properties: () => properties,
    module: () => module(conditions, questionIds, moduleIds),
    section: () => section,
    params: paramsForm,
    question: () => question(questionIds),
  };
  const formSchema = schema[atom.content._type]();

  const hiddenFields = ["id", "post_url"];
  const hidingLogic = ["hide_id", "hide_value", "hide_if", "rand_group"];
  const uiSchema: { [key: string]: any } = {
    ...propertiesSchema,
    ...modulesSchema,
    ...surveySchema,
    ...ParamsPVtSchema,
    "ui:submitButtonOptions": { norender: true },
    required: { "ui:widget": "radio" },
    radio: { "ui:widget": "radio" },
    modal: { "ui:widget": "radio" },
    hide_if: { "ui:widget": "radio" },
    "ui:title": <TitleWidget Title={formSchema.title} />,
    "ui:description": (
      <DescriptionWidget description={formSchema.description} />
    ),
  };

  hiddenFields.forEach(
    (field) => !editableIds && (uiSchema[field] = { "ui:widget": "hidden" })
  );
  hidingLogic.forEach(
    (field) => !showHidingLogic && (uiSchema[field] = { "ui:widget": "hidden" })
  );

  return (
    <div className="px-10 py-5">
      <FormComponent
        onChange={({ formData }) => setAtom(id, formData)}
        onBlur={saveAtoms}
        children={true}
        liveValidate={liveValidation}
        schema={formSchema}
        formData={atom.content}
        validator={validator}
        noValidate={!liveValidation}
        uiSchema={uiSchema}
        idPrefix="form"
        showErrorList="bottom"
      />
    </div>
  );
}
