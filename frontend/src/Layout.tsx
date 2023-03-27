import React, { ReactElement } from "react";
import { validate } from "./utils/actions";
// Icons
import Rotate from "../assets/rotate";
import Calendar from "../assets/calendar";
import { useStore } from "./state";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
// @ts-expect-error
import Logo from "../assets/icon.png";
import { Menu } from "./Menu";
import { Settings } from "./Settings";
export function Layout({ children }: { children: ReactElement }) {
  const { invertDirection, mode, invertMode } = useStore();

  return (
    <main className="max-h-screen overflow-hidden">
      <header className="flex justify-between p-8 pb-6 shadow-md relative">
        <div className="flex">
          <img
            src={Logo}
            alt="MomenTUM logo: A brain with a question mark"
            className="w-10 h-10 "
          />
          <h1 className="text-xl p-2">MomenTUM Study Designer</h1>
        </div>
        <div className="flex justif">
          <Action action={invertDirection}>
            <Rotate /> Rotate Canvas
          </Action>
          <Action action={invertMode}>
            <Calendar /> Switch to {mode === "timeline" ? "graph" : "calendar"} view
          </Action>
          <Action action={validate}>
            <ShieldCheckIcon className="h-6 w-6" />
            Validate Study
          </Action>

          <Menu />
          <Settings />
          {/*
          
          <Action action={addApiKey}>Add API key</Action>
  */}
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
