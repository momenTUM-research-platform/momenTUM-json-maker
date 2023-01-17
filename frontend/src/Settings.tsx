import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "./Calendar";
import { useStore } from "./state";
export function Settings() {
  const { setShowHidingLogic, showHidingLogic, liveValidation, setLiveValidation } = useStore();
  return (
    <Menu as="div" className=" inline-block text-left">
      <div>
        <Menu.Button className="pointer-events-auto ml-4 flex items-center gap-3  rounded-md border-2  border-main py-2 px-3 text-lg font-semibold leading-5 hover:border-sky-500 hover:bg-sky-500 hover:text-white">
          Settings
          <ChevronDownIcon
            className={classNames("ml-2 h-8 w-8 transition duration-150 ease-in-out ")}
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-8 z-10 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <div
                    onClick={() => setLiveValidation(!liveValidation)}
                    className="relative flex items-start py-4"
                  >
                    <div className="min-w-0 flex-1 text-sm">
                      <label htmlFor="comments" className="font-medium text-gray-700">
                        Live Validation
                      </label>
                      <p id="comments-description" className="text-gray-500">
                        Turn on live validation to see errors in the form as you type. Can hurt
                        performance on large forms.
                      </p>
                    </div>
                    <div className="ml-3 flex h-5 items-center">
                      <input
                        id="comments"
                        aria-describedby="comments-description"
                        name="comments"
                        type="checkbox"
                        readOnly
                        checked={liveValidation}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <div
                    onClick={() => setShowHidingLogic(!showHidingLogic)}
                    className="relative flex items-start py-4"
                  >
                    <div className="min-w-0 flex-1 text-sm">
                      <label htmlFor="candidates" className="font-medium text-gray-700">
                        Advanced Hiding Logic
                      </label>
                      <p id="candidates-description" className="text-gray-500">
                        Show advanced hiding logic in the form builder.
                      </p>
                    </div>
                    <div className="ml-3 flex h-5 items-center">
                      <input
                        id="candidates"
                        aria-describedby="candidates-description"
                        name="candidates"
                        type="checkbox"
                        readOnly
                        checked={showHidingLogic}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </a>
              )}
            </Menu.Item>
            {/* <Menu.Item>
              {({ active }) => (
                <a
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <label htmlFor="candidates" className="font-medium text-gray-700">
                        Candidates
                      </label>
                      <p id="candidates-description" className="text-gray-500">
                        Get notified when a candidate applies for a job.
                      </p>
                    </div>
                    <div className="ml-3 flex h-5 items-center">
                      <input
                        id="candidates"
                        aria-describedby="candidates-description"
                        name="candidates"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </a>
              )}
            </Menu.Item>
            */}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
