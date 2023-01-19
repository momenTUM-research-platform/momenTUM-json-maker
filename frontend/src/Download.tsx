import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { resolve } from "path";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { classNames } from "./Calendar";
import { useStore } from "./state";
import { download, upload, validateStudy } from "./utils/actions";
import { constructStudy } from "./utils/construct";
import { deconstructStudy } from "./utils/deconstruct";

const steps = [
  {
    name: "Enter Study ID",
    description: "You can download a study by entering its ID or permalink",
  },
  {
    name: "Download",
    description: "Fetching the study from the server...",
  },
  {
    name: "Verification",
    description: "Quick check that the study is correct",
  },
  { name: "Finished", description: "Everything worked as expected" },
];
export function Download({ close }: { close: () => void }) {
  const [step, setStep] = useState(-1);
  const [studyId, setStudyId] = useState<string | null>(null);
  const [study, setStudy] = useState<Study | null>(null);
  const { setAtoms } = useStore();
  useEffect(() => {
    if (step < 0 || step > 3) return;
    const actions = [
      //  Check study ID
      () =>
        new Promise((resolve, reject) => {
          if (studyId) {
            resolve(null);
          } else reject("You need to enter a study ID");
        }),
      // Download
      () => download(studyId!),
      // Validate
      () =>
        new Promise((resolve, reject) =>
          validateStudy(study) ? resolve(null) : reject("Study is invalid")
        ),
      // Set atoms
      () =>
        new Promise((resolve, reject) => {
          const atoms = deconstructStudy(study!);
          setAtoms(atoms);

          resolve(null);
        }),
    ];
    actions[step]()
      .then((result) => {
        if (step === 1) setStudy(result as Study);
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
          Download Study
        </Dialog.Title>
      </div>
      {step === -1 ? (
        <div>
          <label htmlFor="study_id" className="block text-sm font-medium text-gray-700">
            Study ID
          </label>
          <div className=" flex gap-2 mt-1">
            <input
              type="text"
              name="study_id"
              id="study_id"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="some_random_id"
              aria-describedby="study_id"
              onChange={(e) => setStudyId(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            You can download a study by entering its ID or permalink.
          </p>
        </div>
      ) : (
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
      )}
      <div className="mt-5 sm:mt-6">
        {step < 3 ? (
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            onClick={() => setStep(-1)}
          >
            Enter a different study ID
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            onClick={close}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
