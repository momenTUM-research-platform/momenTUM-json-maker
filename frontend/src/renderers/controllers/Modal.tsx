import { Dialog, Transition } from "@headlessui/react";
import { useStore } from "../../State";
import { Upload } from "../actions/Upload";
import { Download } from "../actions/Download";
import { QR } from "../QR";
import { Fragment } from "react";
import { RedCap } from "../actions/RedcapProjectCreation";
import { ChecklistModal } from "../ChecklistModal";

export function Modal() {
  const { modal, setModal } = useStore();
  const open = !!modal;

  const modals = {
    upload: <Upload close={() => setModal(null)} />,
    download: <Download close={() => setModal(null)} />,
    qr: <QR close={() => setModal(null)} />,
    redcap: <RedCap close={() => setModal(null)} />,
    checklist: <ChecklistModal />,
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setModal(null)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              {modal && modals[modal]}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
