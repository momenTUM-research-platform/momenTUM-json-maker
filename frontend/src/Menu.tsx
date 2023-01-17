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
} from "@heroicons/react/24/outline";
import { download, load, save, saveDictionary, upload } from "./utils/actions";
import { classNames } from "./Calendar";
import { useStore } from "./state";

export function Menu() {
  const { setModal } = useStore();

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
      description: "Save your study on the server and receive a link you can share with anyone.",
      action: () => setModal("upload"),

      icon: CloudArrowUpIcon,
    },
    {
      name: "Download",
      description: "Download any study by its study id or permalink from the server.",
      action: () => setModal("download"),
      icon: CloudArrowDownIcon,
    },
    {
      name: "Generate Redcap Dictionary",
      description:
        "Generate a representation of your study that enables Redcap to store the responses from your participants.",
      action: saveDictionary,
      icon: BookOpenIcon,
    },
    {
      name: "Show QR Code",
      description:
        "See the QR code for the study you are currently working on. You can scan this code with the Momentum app to participate in the study.",
      action: () => setModal("qr"),
      icon: QrCodeIcon,
    },
    //   {
    //     name: "Reports",
    //     description: "Get detailed reports that will help you make more informed decisions",
    //     href: "#",
    //     icon: DocumentChartBarIcon,
    //   },
  ];
  return (
    <Popover className="">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              "pointer-events-auto ml-4 flex items-center gap-3  rounded-md border-2  border-main py-2 px-3 text-lg font-semibold leading-5 hover:border-sky-500 hover:bg-sky-500 hover:text-white"
            )}
          >
            <span>Actions</span>
            <ChevronDownIcon
              className={classNames("ml-2 h-8 w-8 transition duration-150 ease-in-out ")}
              aria-hidden="true"
            />
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
                      <span className="text-base font-medium text-gray-900">Documentation</span>
                      <span className="ml-3 inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium leading-5 text-main">
                        New
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      Access to the API documentation and guides{" "}
                      <a
                        className="text-main underline "
                        href="https://documenter.getpostman.com/view/13190321/2s8Z6zzBti"
                      >
                        here.
                      </a>{" "}
                      Other documentation is in the Github repository{" "}
                      <a
                        className="text-main underline "
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
