import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BookOpenIcon,
  CloudArrowDownIcon,
  CloudArrowUpIcon,
  QrCodeIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { load, save, saveRedcapFileForManual } from "../services/actions";
import { classNames } from "./Calendar";
import { useStore } from "../State";
import { toast } from "react-hot-toast";

export function Menu() {
  const { setModal, study } = useStore();
  
  const actions = [
    {
      name: "Save Study",
      description: "Save your study on your computer in a JSON file.",
      action: save,
      icon: ArrowDownTrayIcon,
    },
    {
      name: "Load Study",
      description: "Load a study from a JSON file on your computer",
      action: load,
      icon: ArrowUpTrayIcon,
    },
    {
      name: "Upload",
      description:
        "Save your study on the server and receive a link you can share with anyone.",
      action: () => setModal("upload"),
      icon: CloudArrowUpIcon,
    },
    {
      name: "Download",
      description:
        "Download any study by its study id or permalink from the server.",
      action: () => setModal("download"),
      icon: CloudArrowDownIcon,
    },
    {
      name: "Create REDCap Project",
      description:
        "Automagically creates a project in REDCap with your study and stores the responses from your participants in it.",
      action: () => setModal("redcap"),
      icon: BookOpenIcon,
    },
    {
      name: "Save REDCap File",
      description:
        "Generate and save the ODM file for manual REDCap upload.",
      action: saveRedcapFileForManual,
      icon: ArrowDownTrayIcon,
    },
    {
      name: "Show QR Code",
      description:
        "See the QR code for the study you are currently working on. You can scan this code with the Momentum app to participate in the study.",
      action: () => setModal("qr"),
      icon: QrCodeIcon,
    },
    {
      name: "View Study Checklist",
      description: "Preview all study settings in a table for a quick sanity check before uploading.",
      action: () => setModal("checklist"),
      icon: TableCellsIcon,
    },
  ];

  return (
    <Popover className="">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              "pointer-events-auto ml-4 flex items-center gap-3 rounded-md py-2 px-3 text-md leading-5 text-black hover:text-blue-500 focus:outline-none"
            )}
          >
            <ChevronDownIcon className="block h-4 w-4" aria-hidden="true" />
            <span>Actions</span>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-28 z-10 mt-3 w-screen max-w-md transform translate-x-20 px-2 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                  {actions.map((item) => (
                    <a
                      key={item.name}
                      onClick={() => item.action()}
                      className="-m-3 flex items-start cursor-pointer rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-main text-white sm:h-12 sm:w-12">
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="bg-gray-50 p-5 sm:p-8">
                  <div className="-m-3 flow-root rounded-md p-3 transition duration-150 ease-in-out hover:bg-gray-100">
                    <span className="flex items-center">
                      <span className="text-base font-medium text-gray-900">
                        Documentation
                      </span>
                      <span className="ml-3 inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium leading-5 text-main">
                        New
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      Access to the documentation and guides{" "}
                      <a
                        className="text-main underline"
                        href="https://make.momentumresearch.eu/api/docs/designer/index.html"
                      >
                        here.
                      </a>{" "}
                      Other documentation is in the Github repository{" "}
                      <a
                        className="text-main underline"
                        href="https://github.com/momenTUM-research-platform/momenTUM-json-maker/wiki"
                      >
                        here.
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}