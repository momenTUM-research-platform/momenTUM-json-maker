// implement for every option in Atoms enum
export function isModule(object: any): object is Module {
  return object._type === "module";
}
export function isSection(object: any): object is Section {
  return object._type === "section";
}
export function isQuestion(object: any): object is Question {
  return object._type === "question";
}
export function isStudy(object: any): object is Study {
  return object._type === "study";
}

// export function isPVT(object: any): object is PVT {
//   return object._type === Atoms.Study
// }
