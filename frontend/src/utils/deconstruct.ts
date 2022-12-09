import { isStudy, isModule, isSection, isQuestion } from "./typeGuards";

export function deconstructStudy(study: Study): Atoms {
  let atoms: Atoms = new Map();

  function extractChildren(object: Study | Question | Module | Section, parent: string | null) {
    if (isStudy(object)) {
      const atom: Atom<Study> = {
        parent: parent,
        subNodes: object.modules.map((m) => m.id),
        type: AtomVariants.Study,
        childType: AtomVariants.Module,
        content: { ...object, _type: AtomVariants.Study },
        title: "Properties",
        actions: [Actions.Count, Actions.Create],
        hidden: false,
      };
      atoms.set("study", atom);
      object.modules.forEach((child) => extractChildren(child, "study"));
    } else if (isModule(object)) {
      const atom: Atom<Module> = {
        parent: parent,
        subNodes: object.sections.map((s) => s.id),
        type: AtomVariants.Study,
        childType: AtomVariants.Module,
        content: { ...object, _type: AtomVariants.Module },
        title: object.name,
        actions: [Actions.Count, Actions.Create],
        hidden: false,
      };

      atoms.set(object.id, atom);
      object.sections.forEach((child) => extractChildren(child, object.id));
    } else if (isSection(object)) {
      const atom: Atom<Section> = {
        parent: parent,
        subNodes: object.questions.map((s) => s.id),
        type: AtomVariants.Study,
        childType: AtomVariants.Module,
        content: { ...object, _type: AtomVariants.Section },
        title: object.name,
        actions: [Actions.Count, Actions.Create],
        hidden: false,
      };

      atoms.set(object.id, atom);
      object.questions.forEach((child) => extractChildren(child, object.id));
    } else if (isQuestion(object)) {
      const atom: Atom<Question> = {
        parent: parent,
        subNodes: null,
        type: AtomVariants.Study,
        childType: AtomVariants.Module,
        content: { ...object, _type: AtomVariants.Question },
        title: object.text,
        actions: [Actions.Count, Actions.Create],
        hidden: false,
      };

      atoms.set(object.id, atom);
    }
  }

  extractChildren(study, null);
  return atoms;
}
