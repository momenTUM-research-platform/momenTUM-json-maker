import { isStudy, isModule, isSection, isQuestion } from "./typeGuards";

export function deconstructStudy(study: Study): Atoms {
  let atoms: Atoms = new Map();

  function extractChildren(object: Study | Question | Module | Section, parent: string | null) {
    // @ts-ignore
    const normalizeID = (id: string) => {
      let n = id.toLowerCase();
      n = n.replace(/[^a-z0-9_]/g, "");
      return n;
    };

    if (isStudy(object)) {
      const atom: Atom<Study> = {
        parent: parent,
        subNodes: object.modules.map((m) => normalizeID(m.id)),
        type: "study",
        childType: "module",
        content: {
          ...object,
          _type: "study",
          properties: { ...object.properties, study_id: normalizeID(object.properties.study_id) },
        },
        title: "Properties",
        actions: ["create"],
        hidden: false,
      };
      atoms.set("study", atom);
      object.modules.forEach((child) => extractChildren(child, normalizeID("study")));
    } else if (isModule(object)) {
      const atom: Atom<Module> = {
        parent: parent,
        subNodes: object.sections.map((s) => normalizeID(s.id)),
        type: "module",
        childType: "section",
        content: { ...object, _type: "module" },
        title: object.name,
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
        content: { ...object, _type: "section" },
        title: object.name,
        actions: ["create", "delete"],
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
        title: object.text,
        actions: ["delete"],
        hidden: false,
      };

      atoms.set(normalizeID(object.id), atom);
    }
  }

  extractChildren(study, null);
  return atoms;
}
