// implement for every option in Atoms enum
export function isModule(object: any): object is Module {
    return object._type === Atoms.Module
}
export function isSection(object: any): object is Section {
    return object._type === Atoms.Section
}
export function isQuestion(object: any): object is Question {
    return object._type === Atoms.Question
}
export function isStudy(object: any): object is Study {
    return object._type === Atoms.Study
}

  // export function isPVT(object: any): object is PVT {
  //   return object._type === Atoms.Study
  // } 