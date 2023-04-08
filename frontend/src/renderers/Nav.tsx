import { useState } from "react";
import Logo from "../../assets/icon.png";
import React, { ReactElement } from "react";
import { validate } from "../services/actions";
// Icons
import Rotate from "../../assets/rotate";
import Calendar from "../../assets/calendar";
import { useStore } from "../state";
import { Menu } from "./Menu";
import { Settings } from "./Settings";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import QueueListIcon from "@heroicons/react/20/solid/QueueListIcon";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const { invertDirection, mode, invertMode } = useStore();
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-lg w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <img
              className="block h-8 w-auto"
              src={Logo}
              alt="MomenTUM logo: A brain with a question mark"
            />
            <h1 className="text-xl text-gray-900 ml-2">
              momenTUM Study Designer
            </h1>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                
                <LockClosedIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <QueueListIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="hidden sm:flex sm:items-center">
            <Action action={invertDirection}>
              <Rotate /> Rotate Canvas
            </Action>
            <Action action={invertMode}>
              <Calendar /> Switch to{" "}
              {mode === "timeline" ? "graph" : "calendar"} view
            </Action>
            <Action action={validate}>
              <ShieldCheckIcon className="h-4 w-4" />
              Validate Study
            </Action>
            <Menu />
            <Settings />
            {/* <Action action={addApiKey}>Add API key</Action> */}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-4 space-y-1">
            <Action action={invertDirection}>
              <Rotate /> Rotate Canvas
            </Action>
            <Action action={invertMode}>
              <Calendar /> Switch to{" "}
              {mode === "timeline" ? "graph" : "calendar"} view
            </Action>
            <Action action={validate}>
              <ShieldCheckIcon className="h-4 w-4" />
              Validate Study
            </Action>
            <Menu />
            <Settings />
            {/* <Action action={addApiKey}>Add API key</Action> */}
          </div>
        </div>
      )}
    </nav>
  );
}

function Action({
  children,
  action,
}: {
  children: React.ReactNode;
  action: () => void;
}) {
  return (
    <button
      className="ml-4 flex items-center gap-3  py-2 px-3 text-md rounded-md  text-black hover:text-blue-600 focus:outline-none"
      onClick={action}
    >
      {children}
    </button>
  );
}

export default Nav;
