import { AtomVariants, useStore } from "../state";

export function contructStudy(): Study {
  const { atoms } = useStore.getState();
  const start = JSON.parse(JSON.stringify(atoms.get("study")!));

  function appendChildren(atom: Atom<Study | Question | Module | Section>) {
    let result = atom.content;
    atom.subNodes &&
      atom.subNodes.forEach((id) => {
        let node = atoms.get(id);
        if (node) {
          const copy = JSON.parse(JSON.stringify(node)); // Copy
          const children = appendChildren(copy);
          switch (result._type) {
            case AtomVariants.Study: {
              //@ts-expect-error
              result.modules.push(children);
              break;
            }
            case AtomVariants.Module: {
              // @ts-expect-error
              result.sections.push(children);
              break;
            }
            case AtomVariants.Section: {
              // @ts-expect-error
              result.questions.push(children);
              break;
            }
          }
        }
      });
    return result;
  }

  let study = appendChildren(start) as Study;
  return study;
}