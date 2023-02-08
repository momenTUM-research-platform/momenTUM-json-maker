import { isProperties, isModule, isSection, isQuestion } from "./typeGuards";

export function deconstructStudy(study: Study): Atoms {
  let atoms: Atoms = new Map();

  function extractChildren(object: Study | Question | Module | Section, parent: string | null) {
    // @ts-ignore
    const normalizeID = (id: string) => {
      let n = id.toLowerCase();
      n = n.replace(/[^a-z0-9_]/g, "");
      return n;
    };

    if (isModule(object)) {
      const atom: Atom<Module> = {
        parent: parent,
        subNodes: object.sections.map((s) => normalizeID(s.id)),
        type: "module",
        childType: "section",
        content: { ...object, _type: "module", sections: [] },
        title: object.name.length > 32 ? object.name.slice(0, 32) + "..." : object.name,

        actions: ["create", "delete"],
        hidden: false,
      };

      atoms.set(normalizeID(object.id), atom);
      object.sections.forEach((child) => extractChildren(child, normalizeID(object.id)));
    } else if (isSection(object)) {
      const atom: Atom<Section> = {
        parent: parent,
        subNodes: object.questions.map((s) => normalizeID(s.id)),
        type: "section",
        childType: "question",
        content: { ...object, _type: "section", questions: [] },
        title: object.name.length > 32 ? object.name.slice(0, 32) + "..." : object.name,

        actions: ["create", "delete", "earlier", "later"],
        hidden: false,
      };

      atoms.set(normalizeID(object.id), atom);
      object.questions.forEach((child) => extractChildren(child, normalizeID(object.id)));
    } else if (isQuestion(object)) {
      const atom: Atom<Question> = {
        parent: parent,
        subNodes: null,
        type: "question",
        childType: null,
        content: { ...object, _type: "question" },
        title: object.text.length > 32 ? object.text.slice(0, 60) + "..." : object.text,
        actions: ["delete", "earlier", "later"],
        hidden: false,
      };

      atoms.set(normalizeID(object.id), atom);
    } else {
      // Must be the top level study object
      const study: Atom<Study> = {
        parent: null,
        subNodes: ["properties", ...object.modules.map((m) => normalizeID(m.id))],
        type: "study",
        childType: "module",
        title: object.properties.study_name,
        actions: ["create"],
        hidden: false,
        content: {
          properties: {} as Properties, // Left empty until construction
          modules: [],
          _type: "study",
        },
      };
      const properties: Atom<Properties> = {
        parent: "study",
        subNodes: null,
        type: "properties",
        childType: null,
        content: {
          ...object.properties,
          _type: "properties",
          study_id: normalizeID(object.properties.study_id),
        },
        title: "Properties",
        actions: [],
        hidden: false,
      };
      atoms.set("study", study);
      atoms.set("properties", properties);
      object.modules.forEach((child) => extractChildren(child, normalizeID("study")));
    }
  }

  extractChildren(study, null);
  return atoms;
}
