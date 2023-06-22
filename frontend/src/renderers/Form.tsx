import FormComponent from "@rjsf/fluent-ui";
import validator from "@rjsf/validator-ajv8";
import { useMemo, useState } from "react";
import { properties } from "../../schema/properties";
import { section } from "../../schema/section";
import { question } from "../../schema/question";
import { module } from "../../schema/module";
import { paramsPVT } from "../../schema/paramsPVT";
import { paramsSurvey } from "../../schema/paramsSurvey";
import TitleWidget from "./uischema/components/TitleWidget";
import DescriptionWidget from "./uischema/components/DescriptionWidget";
import { propertiesSchema } from "./uischema/PropertiesSchema";
import { modulesSchema } from "./uischema/ModuleSchema";
import { surveySchema } from "./uischema/SurveySchema";
import { ParamsPVtSchema } from "./uischema/ParamsPVTSchema";
import { useStore } from '../State';

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

    // @ts-ignore
    "ui:title": <TitleWidget Title={formSchema.title} />,

    "ui:description": (
      // @ts-ignore
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
