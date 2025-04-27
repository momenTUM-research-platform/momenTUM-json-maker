import React, { useMemo, useState } from "react";
import FormComponent from "@rjsf/fluent-ui";
import validator from "@rjsf/validator-ajv8";
import debounce from "lodash/debounce";
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

/**
 * Form renders a JSON-schema-driven form for any atom node.
 * It auto-saves state on change (debounced) to avoid stale onBlur races,
 * merges partial formData onto existing content to preserve all keys,
 * and hides legacy fields when needed.
 */
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

  // Grab the atom for this node
  const atom = atoms.get(id);
  if (!atom) {
    console.error(`Atom ${id} does not exist.`);
    return null;
  }

  // Debounce persisting to avoid racing stale onBlur calls
  const debouncedSave = useMemo(() => debounce(saveAtoms, 300), [saveAtoms]);

  // Build enums for dropdowns
  const [questionIds, setQuestionIds] = useState<SchemaEnum[]>([]);
  const [moduleIds, setModuleIds] = useState<SchemaEnum[]>([]);
  useMemo(() => {
    const qIds: SchemaEnum[] = [{ id: "none", text: "None" }];
    const mIds: SchemaEnum[] = [];
    atoms.forEach((value, key) => {
      if (value.content._type === "question") {
        qIds.push({ id: key, text: value.content.text });
      } else if (value.content._type === "module" && key !== id) {
        mIds.push({ id: key, text: value.content.name });
      }
    });
    setQuestionIds(qIds);
    setModuleIds(mIds);
  }, [atoms]);

  // Schema factory functions
  const studyForm = () => ({
    $id: "#",
    type: "object",
    title: "Study",
    description:
      "Entrypoint. Click on properties or the green '+' symbol to begin.",
  });
  const paramsForm = () =>
    atom.content._type === "params" && atom.content.type === "survey"
      ? paramsSurvey(questionIds)
      : paramsPVT;

  const schemaMap: Record<AtomVariants, () => object> = {
    study: studyForm,
    properties: () => properties,
    module: () => module(conditions, questionIds, moduleIds),
    section: () => section,
    params: paramsForm,
    question: () => question(questionIds),
  };
  const formSchema = schemaMap[atom.content._type]();

  // Build uiSchema with hiding logic
  const hiddenFields = ["id", "post_url"];
  const hidingLogic = ["hide_id", "hide_value", "hide_if", "rand_group"];
  const uiSchema: Record<string, any> = {
    ...propertiesSchema,
    ...modulesSchema,
    ...surveySchema,
    ...ParamsPVtSchema,
    "ui:submitButtonOptions": { norender: true },
    "ui:title": <TitleWidget Title={formSchema.title} />,
    "ui:description": <DescriptionWidget description={formSchema.description} />,
  };
  if (!editableIds) hiddenFields.forEach(f => (uiSchema[f] = { "ui:widget": "hidden" }));
  if (!showHidingLogic) hidingLogic.forEach(f => (uiSchema[f] = { "ui:widget": "hidden" }));

  return (
    <div className="px-10 py-5">
      <FormComponent
        schema={formSchema}
        formData={atom.content}
        uiSchema={uiSchema}
        validator={validator}
        idPrefix="form"
        liveValidate={liveValidation}
        noValidate={!liveValidation}
        showErrorList="bottom"
        /**
         * onChange: merge incoming partial formData onto existing content
         *          to preserve all keys (nested and hidden fields).
         *          Then schedule a debounced save.
         */
        onChange={({ formData }) => {
          const old = useStore.getState().atoms.get(id)!.content;
          setAtom(id, { ...old, ...formData });
          debouncedSave();
        }}
        /**
         * Remove onBlur: we persist only via debounced onChange
         * to avoid stale blur races.
         */
        children={true}
      />
    </div>
  );
}
