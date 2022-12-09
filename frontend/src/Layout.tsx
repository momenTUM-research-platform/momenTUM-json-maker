import React, { ReactChildren, ReactElement } from "react";
import { download, load, save, upload, validate } from "./utils/actions";
// Icons
import Rotate from "../assets/rotate";
import Download from "../assets/download";
import Upload from "../assets/upload";
import Load from "../assets/load";
import Save from "../assets/save";
import Calendar from "../assets/calendar";
import { Mode, useStore } from "./state";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
// @ts-expect-error
import Logo from "../assets/icon.png";
export function Layout({ children }: { children: ReactElement }) {
  const { invertDirection, mode, invertMode } = useStore();

  return (
    <main className="max-h-screen overflow-hidden">
      <header className="flex justify-between p-8 pb-6 shadow-md ">
        <div className="flex">
          <img
            src={Logo}
            alt="MomenTUM logo: A brain with a question mark"
            className="w-10 h-10 "
          />
          <h1 className="text-xl p-2">MomenTUM-JSON-Maker</h1>
        </div>
        <div className="flex justif">
          <Action action={invertDirection}>
            <Rotate /> Rotate Canvas
          </Action>
          <Action action={invertMode}>
            <Calendar /> Switch to {mode === Mode.Graph ? "timeline" : "graph"} view
          </Action>
          <Action action={validate}>
            <ShieldCheckIcon className="h-6 w-6" />
            Validate Study
          </Action>
          <Action action={save}>
            <Save />
            Save Study
          </Action>

          <Action action={load}>
            <Load />
            Load Study
          </Action>
          <Action action={upload}>
            <Upload /> Upload Study
          </Action>
          <Action action={download}>
            <Download />
            Download Study
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

function Action({ children, action }: { children: React.ReactNode; action: () => void }) {
  return (
    <button
      className="pointer-events-auto ml-4 flex items-center gap-3  rounded-md  bg-main py-2 px-3 text-lg font-semibold leading-5 text-white hover:bg-sky-500"
      onClick={action}
    >
      {children}
    </button>
  );
}
