import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import QRCode from "react-qr-code";
import { useMemo, useState } from "react";
import { useStore } from "./state";
import { constructStudy } from "./utils/construct";

export function QR({ close }: { close: () => void }) {
  const { permalink, atoms } = useStore();
  const [selection, setSelection] = useState(0);
  const study = useMemo(() => constructStudy(atoms), [atoms]);
  const study_id = study.properties.study_id;
  const url = "tuspl22-momentum.srv.mwn.de/api/v1/" + (selection === 1 ? permalink : study_id);

  if (!permalink)
    return (
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 mb-2 text-center sm:mt-5">
          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            View QR Code
          </Dialog.Title>
        </div>
        Please upload the study first
      </div>
    );

  return (
    <div>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <div className="mt-3 mb-2 text-center sm:mt-5">
        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
          View QR Code
        </Dialog.Title>
      </div>
      <span className="isolate inline-flex  rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => setSelection(0)}
          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          Study ID
        </button>
        <button
          type="button"
          onClick={() => setSelection(1)}
          className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          Permalink
        </button>
      </span>
      <p className="text-xs pt-2 text-gray-500">
        The <i>Study ID link </i> will lead to new versions of this study if you upload updates with
        the same study ID again. The <i>Permalink</i> will not always show the content you just
        uploaded, irrespective of future updates.
      </p>
      <div className="mt-2  sm:mt-4">
        <QRCode value={url} />
      </div>
      <a className="mt-2 block underline text-main" href={url}>
        Also accessible through this link
      </a>
      <div className="mt-5 sm:mt-4">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          onClick={close}
        >
          Go back to editor
        </button>
      </div>
    </div>
  );
}
