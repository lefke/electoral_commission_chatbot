import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Disclaimers } from './ui/Disclaimers';

export default function LoadingModal() {
  let [isOpen, setIsOpen] = useState(true);

  function closeModal() {}

  function closeModalButton() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 p-0 text-ec_blue text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6 px-6 pt-6 pb-3"
                >
                  When decoding electoral guidance feels a bit like:
                </Dialog.Title>
                <div className="mt-2">
                  <div className="px-6 pb-3 width:100%;height:0;padding-bottom:100%;position:relative;">
                    <iframe
                      src="https://giphy.com/embed/BZNGgpMF2Nnx8nEO6q"
                      width="100%"
                      height="100%"
                      className="position:absolute giphy-embed"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <h2 className="px-6 pb-3">
                    Ask the (unofficial) chat bot to do the searching for you
                  </h2>
                  <div className="bg-white p-6 pb-3">
                    <h3 className=" text-gray-500">Disclaimers</h3>
                    <Disclaimers />
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="candidates"
                          className="font-medium text-gray-900"
                        >
                          I have read and acknowledge the disclaimers
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center bg-white p-6 pt-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModalButton}
                  >
                    Get started!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
