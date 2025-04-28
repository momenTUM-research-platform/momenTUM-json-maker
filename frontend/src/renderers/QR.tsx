import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import QRCode from "react-qr-code";
import { useMemo, useState } from "react";
import { useStore } from "../State";
import { constructStudy } from "../utils/construct";
import { API_URL } from "../App";

export function QR({ close }: { close: () => void }) {
  const { permalink, atoms } = useStore();
  const [selection, setSelection] = useState(0);

  const study = useMemo(() => constructStudy(atoms), [atoms]);
  const studyId = study.properties.study_id;

  const url = `${API_URL}/studies/` + (selection === 1 ? permalink : studyId);

  if (!permalink) {
    return (
      <div className="text-center p-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-4">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            View QR Code
          </Dialog.Title>
          <p className="mt-2 text-sm text-gray-600">
            Please upload the study first to generate the QR code.
          </p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={close}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            Go back to editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Check icon */}
      <div className="flex justify-center">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
      </div>

      {/* Title */}
      <div className="mt-4 text-center">
        <Dialog.Title className="text-lg font-semibold text-gray-900">
          View QR Code
        </Dialog.Title>
      </div>

      {/* Selection buttons */}
      <div className="mt-4 flex justify-center">
        <span className="isolate inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setSelection(0)}
            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:ring-1 focus:ring-indigo-500"
          >
            Study ID
          </button>
          <button
            type="button"
            onClick={() => setSelection(1)}
            disabled={!permalink}
            className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          >
            Permalink
          </button>
        </span>
      </div>

      {/* Current Study ID */}
      <p className="mt-2 text-sm text-center text-gray-500">
        Current Study ID: <span className="font-medium">{studyId}</span>
      </p>

      {/* Left-aligned explanation */}
      <div className="mt-2 text-xs text-gray-500 max-w-md mx-auto text-left">
        <p>
          The <i>Study ID</i> link points to the latest version of the study.
        </p>
        <p>
          The <i>Permalink</i> points exactly to the uploaded version.
        </p>
      </div>

      {/* QR code */}
      <div className="mt-6 flex justify-center">
        <QRCode value={url} size={192} />
      </div>

      {/* Link */}
      <div className="mt-4 flex justify-center">
        <a
          className="text-sm underline text-main hover:text-indigo-700"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Also accessible through this link
        </a>
      </div>

      {/* Close button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={close}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
        >
          Go back to editor
        </button>
      </div>
    </div>
  );
}