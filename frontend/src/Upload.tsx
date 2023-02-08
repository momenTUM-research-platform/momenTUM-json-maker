import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { resolve } from "path";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { classNames } from "./Calendar";
import { useStore } from "./state";
import { upload, validateStudy } from "./utils/actions";
import { constructStudy } from "./utils/construct";

const steps = [
  {
    name: "Authentication",
    description: "Authenticate yourself with the server",
  },
  {
    name: "Verification",
    description: "Quick check that the study is correct",
  },
  {
    name: "Upload",
    description: "Saving forever (ok until tomorrow at least)",
  },
  { name: "Finished", description: "Everything worked as expected" },
];
export function Upload({ close }: { close: () => void }) {
  const [step, setStep] = useState(0);
  const { atoms, setModal, setPermalink } = useStore();
  const study: Study = useMemo(() => constructStudy(atoms), []);
  useEffect(() => {
    if (step < 0 || step > 3) return;
    const actions = [
      //  Authenticate
      () =>
        new Promise((resolve, reject) => {
          resolve(null);
        }), // Not yet implemented
      // Validate
      () =>
        new Promise((resolve, reject) =>
          validateStudy(study) ? resolve(null) : reject("Study is invalid")
        ),
      // Upload
      () => upload(study),
      // Finished
      () => new Promise((resolve, reject) => resolve(null)),
    ];
    actions[step]()
      .then((result) => {
        if (step === 2) setPermalink(result as string);
        setStep(step + 1);
      })
      .catch((e) => toast.error(e));
  }, [step]);

  return (
    <div>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <div className="mt-3 mb-2 text-center sm:mt-5">
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
          Upload
        </Dialog.Title>
      </div>

      <nav aria-label="Progress">
        <ol role="list" className="overflow-hidden">
          {steps.map((content, stepIdx) => (
            <li
              key={content.name}
              className={classNames(stepIdx !== steps.length - 1 ? "pb-10" : "", "relative")}
            >
              {stepIdx < step ? (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-600"
                      aria-hidden="true"
                    />
                  ) : null}
                  <a className="group relative flex items-start">
                    <span className="flex h-9 items-center">
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                        <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium">{content.name}</span>
                      <span className="text-sm text-gray-500">{content.description}</span>
                    </span>
                  </a>
                </>
              ) : step === stepIdx ? (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                      aria-hidden="true"
                    />
                  ) : null}
                  <a className="group relative flex items-start">
                    <span className="flex h-9 items-center" aria-hidden="true">
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-indigo-600">{content.name}</span>
                      <span className="text-sm text-gray-500">{content.description}</span>
                    </span>
                  </a>
                </>
              ) : (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                      aria-hidden="true"
                    />
                  ) : null}
                  <a className="group relative flex items-start">
                    <span className="flex h-9 items-center" aria-hidden="true">
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                      </span>
                    </span>
                    <span className="ml-4 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-gray-500">{content.name}</span>
                      <span className="text-sm text-gray-500">{content.description}</span>
                    </span>
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {step === 4 ? (
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            onClick={() => setModal("qr")}
          >
            Get Download Link + QR-Code
          </button>
        </div>
      ) : (
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            onClick={close}
          >
            Go back to editor
          </button>
        </div>
      )}
    </div>
  );
}
