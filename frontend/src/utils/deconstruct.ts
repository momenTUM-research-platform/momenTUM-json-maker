import { isStudy, isModule, isSection, isQuestion } from "./typeGuards";

export function deconstructStudy(study: Study): Atoms {
  let atoms: Atoms = new Map();

  function extractChildren(object: Study | Question | Module | Section, parent: string | null) {
    if (isStudy(object)) {
      const atom: Atom<Study> = {
        parent: parent,
        subNodes: object.modules.map((m) => m.id),
        type: "study",
        childType: "module",
        content: { ...object, _type: "study" },
        title: "Properties",
        actions: ["create"],
        hidden: false,
      };
      atoms.set("study", atom);
      object.modules.forEach((child) => extractChildren(child, "study"));
    } else if (isModule(object)) {
      const atom: Atom<Module> = {
        parent: parent,
        subNodes: object.sections.map((s) => s.id),
        type: "study",
        childType: "module",
        content: { ...object, _type: "module" },
        title: object.name,
        actions: ["create", "delete"],
        hidden: false,
      };

      atoms.set(object.id, atom);
      object.sections.forEach((child) => extractChildren(child, object.id));
    } else if (isSection(object)) {
      const atom: Atom<Section> = {
        parent: parent,
        subNodes: object.questions.map((s) => s.id),
        type: "study",
        childType: "module",
        content: { ...object, _type: "section" },
        title: object.name,
        actions: ["create", "delete"],
        hidden: false,
      };

      atoms.set(object.id, atom);
      object.questions.forEach((child) => extractChildren(child, object.id));
    } else if (isQuestion(object)) {
      const atom: Atom<Question> = {
        parent: parent,
        subNodes: null,
        type: "study",
        childType: "module",
        content: { ...object, _type: "question" },
        title: object.text,
        actions: ["delete"],
        hidden: false,
      };

      atoms.set(object.id, atom);
    }
  }

  extractChildren(study, null);
  return atoms;
}
