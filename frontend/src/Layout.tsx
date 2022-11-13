import React, { ReactChildren, ReactElement } from "react";
import {
  
  download,
  
  load,
  save,
  upload,
  
} from "./utils/actions";

// Icons
import Rotate from "../assets/rotate"
import Download from "../assets/download";
import Upload from "../assets/upload";
import Load from "../assets/load";
import Save from "../assets/save";
import { useStore } from "./state";

export function Layout({ children }: { children: ReactElement }) {

  return (
    <main className="max-h-screen overflow-hidden">
      <header className="flex justify-between p-8 pb-6 shadow-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"  >
        <div className="flex">
          <img
            src="/assets/icon.png"
            alt="MomenTUM logo: A brain with a question mark"
            className="w-10 h-10 "
          />
          <h1 className="text-xl p-2">MomenTUM-JSON-Maker</h1>
        </div>
        <div className="flex justif">
          <Action action={useStore().invertDirection} ><Rotate /> Rotate Canvas</Action>
          <Action action={save}>
            <Save />
            Save JSON file
          </Action>

          <Action action={load}>
            <Load />
            Load JSON file
          </Action>
          <Action action={upload}>
            <Upload /> Upload JSON file
          </Action>
          <Action action={download}>
            <Download />
            Download JSON file
          </Action>
          {/* <Action action={generateDictionary}>Generate RedCap Dictionary</Action>
          <Action action={addApiKey}>Add API key</Action>
          <Action action={validate}>Validate</Action> */}
        </div>
      </header>
      {children}
      <footer></footer>
    </main>
  );
}

function Action({ children, action }) {
  return (
    <button
      className="pointer-events-auto ml-4 flex items-center gap-3  rounded-md bg-main py-2 px-3 text-lg font-semibold leading-5 text-white hover:bg-sky-500"
      onClick={action}
    >
      {children}
    </button>
  );
}
