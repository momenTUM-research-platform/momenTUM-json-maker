import { Study, Question } from "../types/schema";

/**
 * Map a question type to a REDCap field type.
 */
function getFieldType(question: Question): string {
  switch (question.type) {
    case "text":
    case "datetime":
      return "text";
    case "yesno":
      return "yesno";
    case "slider":
      return "slider";
    case "multi":
      return question.radio ? "radio" : "checkbox";
    default:
      return "text";
  }
}

/**
 * Generate a universal REDCap-compatible ODM XML string.
 * This function creates one MetaDataVersion that includes one FormDef and two ItemGroupDefs per module.
 * It also produces system ItemDefs and survey question ItemDefs.
 *
 * - The record ID field is only produced once (in the first module).
 * - Each module always produces response time fields and a "Complete?" field with its own CodeList.
 *
 * @param study - The study JSON object.
 * @returns The ODM XML as a string.
 */
export function generateOdmXml(study: Study): string {
  const { study_name, instructions } = study.properties;
  const description = study_name; // Use study name for the description.
  // Remove spaces from study name for OIDs.
  const sanitizedStudyName = study_name.replace(/\s+/g, "");
  // Use current timestamp in ISO format (without milliseconds).
  const now = new Date();
  const formattedTimestamp = now.toISOString().split('.')[0];

  // Build the GlobalVariables block (same for all modules)
  const globalVariablesXml =
    "<GlobalVariables>" +
      "<StudyName>" + study_name + "</StudyName>" +
      "<StudyDescription>This file contains the metadata, events, and data for REDCap project \"" + study_name + "\".</StudyDescription>" +
      "<ProtocolName>" + study_name + "</ProtocolName>" +
      "<redcap:RecordAutonumberingEnabled>0</redcap:RecordAutonumberingEnabled>" +
      "<redcap:CustomRecordLabel></redcap:CustomRecordLabel>" +
      "<redcap:SecondaryUniqueField></redcap:SecondaryUniqueField>" +
      "<redcap:SchedulingEnabled>0</redcap:SchedulingEnabled>" +
      "<redcap:SurveysEnabled>1</redcap:SurveysEnabled>" +
      "<redcap:SurveyInvitationEmailField></redcap:SurveyInvitationEmailField>" +
      "<redcap:MyCapEnabled>0</redcap:MyCapEnabled>" +
      "<redcap:Purpose>2</redcap:Purpose>" +
      "<redcap:PurposeOther></redcap:PurposeOther>" +
      "<redcap:ProjectNotes>" + instructions + "</redcap:ProjectNotes>" +
      "<redcap:MissingDataCodes></redcap:MissingDataCodes>" +
      "<redcap:ProtectedEmailMode>0</redcap:ProtectedEmailMode>" +
      "<redcap:ProtectedEmailModeCustomText></redcap:ProtectedEmailModeCustomText>" +
      "<redcap:ProtectedEmailModeTrigger>ALL</redcap:ProtectedEmailModeTrigger>" +
      "<redcap:ProtectedEmailModeLogo></redcap:ProtectedEmailModeLogo>" +
      // Build one repeating instrument per module:
      "<redcap:RepeatingInstrumentsAndEvents>" +
        "<redcap:RepeatingInstruments>" +
          (study.modules && study.modules.length > 0 ? study.modules
            .map(module => "<redcap:RepeatingInstrument redcap:UniqueEventName=\"event_1_arm_1\" redcap:RepeatInstrument=\"module_" + module.id + "\" redcap:CustomLabel=\"\"/>")
            .join("") : "") +
        "</redcap:RepeatingInstruments>" +
      "</redcap:RepeatingInstrumentsAndEvents>" +
    "</GlobalVariables>";

  // Create a MetaDataVersion OID based on study name and timestamp.
  const metaDataOID = "Metadata." + sanitizedStudyName + "_" + formattedTimestamp.replace(/[-:T]/g, "").slice(0, 12);

  // Arrays to accumulate XML fragments.
  let formDefs: string[] = [];
  let itemGroupDefs: string[] = [];
  let itemDefs: string[] = [];
  let codeLists: string[] = [];

  // For system fields: always include response_time fields. Record ID is included only in the first module.
  const defaultFields = [];
  // If first module, add record_id field.
  if (study.modules && study.modules.length > 0) {
    defaultFields.push({ id: "field_record_id", label: "Record ID" });
  }
  // For each module, add response time fields.
  // (These might be unique per module, so we incorporate the module index.)
  // response_time_in_ms and response_time is added for each module.
  study.modules?.forEach((module, index) => {
    defaultFields.push({
      id: "field_response_time_in_ms_" + index,
      label: "Response Time in Milliseconds"
    });
    defaultFields.push({
      id: "field_response_time_" + index,
      label: "Response Time"
    });
  });

  // Build ItemDef for each default field.
  defaultFields.forEach(f => {
    itemDefs.push(
      "<ItemDef OID=\"" + f.id + "\" Name=\"" + f.id +
      "\" DataType=\"text\" Length=\"999\" redcap:Variable=\"" + f.id +
      "\" redcap:FieldType=\"text\">" +
        "<Question><TranslatedText>" + f.label + "</TranslatedText></Question>" +
      "</ItemDef>"
    );
  });

  // Process each module to produce its form and fields.
  study.modules?.forEach((module, index) => {
    const moduleId = module.id;
    // Build one FormDef per module.
    formDefs.push(
      "<FormDef OID=\"Form.module_" + moduleId + "\" Name=\"Module " + moduleId +
      "\" Repeating=\"No\" redcap:FormName=\"module_" + moduleId + "\">" +
        "<ItemGroupRef ItemGroupOID=\"module_" + moduleId + ".fields\" Mandatory=\"No\"/>" +
        "<ItemGroupRef ItemGroupOID=\"module_" + moduleId + ".complete\" Mandatory=\"No\"/>" +
      "</FormDef>"
    );

    // First ItemGroupDef for module fields (system fields and survey questions)
    let itemRefs = [];
    // For system fields in this module, include the fields with a module-specific suffix.
    // Record ID is added only for module 0.
    if (index === 0 && study.modules && study.modules.length > 0) {
      itemRefs.push("<ItemRef ItemOID=\"field_record_id\" Mandatory=\"No\" redcap:Variable=\"field_record_id\"/>");
    }
    // Add response time fields for this module.
    itemRefs.push("<ItemRef ItemOID=\"field_response_time_in_ms_" + index +
      "\" Mandatory=\"No\" redcap:Variable=\"field_response_time_in_ms_" + index + "\"/>");
    itemRefs.push("<ItemRef ItemOID=\"field_response_time_" + index +
      "\" Mandatory=\"No\" redcap:Variable=\"field_response_time_" + index + "\"/>");

    // Process survey questions in this module.
    if (module.params && "sections" in module.params && Array.isArray(module.params.sections)) {
      module.params.sections.forEach((section: any) => {
        if (section.questions && Array.isArray(section.questions)) {
          section.questions.forEach((question: any) => {
            const fieldName = "field_" + question.id;
            const fieldLabel = question.text
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            itemRefs.push("<ItemRef ItemOID=\"" + fieldName + "\" Mandatory=\"No\" redcap:Variable=\"" + fieldName + "\"/>");
            // Build the ItemDef for the survey question.
            itemDefs.push(
              "<ItemDef OID=\"" + fieldName + "\" Name=\"" + fieldName +
              "\" DataType=\"text\" Length=\"999\" redcap:Variable=\"" + fieldName +
              "\" redcap:FieldType=\"" + getFieldType(question) + "\">" +
                "<Question><TranslatedText>" + fieldLabel + "</TranslatedText></Question>" +
              "</ItemDef>"
            );
          });
        }
      });
    }

    // Create the first ItemGroupDef for this module.
    itemGroupDefs.push(
      "<ItemGroupDef OID=\"module_" + moduleId + ".fields\" Name=\"Module " + moduleId +
      "\" Repeating=\"No\">" +
        itemRefs.join("") +
      "</ItemGroupDef>"
    );

    // For each module, create the "Complete?" field and its group.
    // Build the ItemDef for "Complete?".
    itemDefs.push(
      "<ItemDef OID=\"module_" + moduleId + "_complete\" Name=\"module_" + moduleId +
      "_complete\" DataType=\"text\" Length=\"1\" redcap:Variable=\"module_" + moduleId +
      "_complete\" redcap:FieldType=\"select\" redcap:SectionHeader=\"Form Status\">" +
        "<Question><TranslatedText>Complete?</TranslatedText></Question>" +
        "<CodeListRef CodeListOID=\"module_" + moduleId + "_complete.choices\"/>" +
      "</ItemDef>"
    );
    // Build the CodeList for "Complete?".
    codeLists.push(
      "<CodeList OID=\"module_" + moduleId + "_complete.choices\" Name=\"module_" + moduleId +
      "_complete\" DataType=\"text\" redcap:Variable=\"module_" + moduleId + "_complete\">" +
        "<CodeListItem CodedValue=\"0\"><Decode><TranslatedText>Incomplete</TranslatedText></Decode></CodeListItem>" +
        "<CodeListItem CodedValue=\"1\"><Decode><TranslatedText>Unverified</TranslatedText></Decode></CodeListItem>" +
        "<CodeListItem CodedValue=\"2\"><Decode><TranslatedText>Complete</TranslatedText></Decode></CodeListItem>" +
      "</CodeList>"
    );
    // Build the second ItemGroupDef for the "Complete?" field.
    itemGroupDefs.push(
      "<ItemGroupDef OID=\"module_" + moduleId + ".complete\" Name=\"Form Status\" Repeating=\"No\">" +
        "<ItemRef ItemOID=\"module_" + moduleId + "_complete\" Mandatory=\"No\" redcap:Variable=\"module_" + moduleId + "_complete\"/>" +
      "</ItemGroupDef>"
    );
  });

  // Assemble the MetaDataVersion element.
  const metaDataVersionXml =
    "<MetaDataVersion OID=\"" + metaDataOID + "\" Name=\"" + study_name +
    "\" redcap:RecordIdField=\"field_record_id\">" +
      formDefs.join("") +
      itemGroupDefs.join("") +
      itemDefs.join("") +
      codeLists.join("") +
    "</MetaDataVersion>";

  // Build the final ODM XML.
  const odmXml =
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
    "<ODM xmlns=\"http://www.cdisc.org/ns/odm/v1.3\" " +
         "xmlns:ds=\"http://www.w3.org/2000/09/xmldsig#\" " +
         "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
         "xmlns:redcap=\"https://projectredcap.org\" " +
         "xsi:schemaLocation=\"http://www.cdisc.org/ns/odm/v1.3 schema/odm/ODM1-3-1.xsd\" " +
         "ODMVersion=\"1.3.1\" " +
         "FileOID=\"000-00-0000\" " +
         "FileType=\"Snapshot\" " +
         "Description=\"" + description + "\" " +
         "AsOfDateTime=\"" + formattedTimestamp + "\" " +
         "CreationDateTime=\"" + formattedTimestamp + "\" " +
         "SourceSystem=\"REDCap\" " +
         "SourceSystemVersion=\"13.4.13\">" +
      "<Study OID=\"Project." + sanitizedStudyName + "\">" +
         globalVariablesXml +
         metaDataVersionXml +
      "</Study>" +
    "</ODM>";

  console.debug("[generateOdmXml] Generated ODM XML:", odmXml);
  return odmXml;
}