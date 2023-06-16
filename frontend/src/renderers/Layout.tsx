import React, { ReactElement } from "react";
import { validate } from "../services/actions";
// Icons
import Rotate from "../../assets/rotate";
import Calendar from "../../assets/calendar";
import { useStore } from "../state";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
// @ts-expect-error
import Logo from "../../assets/icon.png";
import { Menu } from "./Menu";
import { Settings } from "./Settings";
import Nav from "./Nav";
export function Layout({ children }: { children: ReactElement }) {
  const { invertDirection, mode, invertMode } = useStore();

  return (
    <main className="max-h-screen overflow-hidden w-screen">
      <header>
        <Nav />
      </header>
      {children}
      <footer className="absolute w-full border bg-gray-100 text-grey-400 p-4 overflow-y-auto max-h-20">
        <p className="text-center text-sm">© 2023 All rights reserved.</p>
      </footer>
    </main>
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
      className="pointer-events-auto ml-4 flex items-center gap-3   rounded-md  text-black hover:text-blue-600 focus:outline-none"
      onClick={action}
    >
      {children}
    </button>
  );
}
