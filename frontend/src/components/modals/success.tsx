import { Fragment, ReactElement, useState } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { HiXMark } from "react-icons/hi2";
import { IBooking } from "../../utils/interfaces";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  resetParams: () => void;
  params: IBooking;
  modalContent: ImodalContent;
};

type ImodalContent = {
  title: string;
  message: ReactElement;
  status: boolean;
  data: any;
};

const SuccessModal = (props: Props) => {
  const { open, setOpen, resetParams, modalContent } = props;

  const navigate = useNavigate();

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
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
              {/* <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"> */}
              <Dialog.Panel className="w-full max-w-142.5 transform overflow-hidden align-middle transition-all rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
                {modalContent.status == true ? (
                  <div className="mx-auto flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-success-100 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="h-12 w-12 text-success-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <div className="mx-auto flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-red-100 ">
                    <svg
                      className="h-12 w-12 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                )}
                <Dialog.Title
                  as="h3"
                  className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl"
                >
                  {modalContent.title}
                </Dialog.Title>
                <div className="mt-2 mb-10">
                  <p className="text-sm text-gray-500">
                    {modalContent.message}
                  </p>
                </div>

                <div className="-mx-3 flex flex-wrap gap-y-4">
                  <div className="w-full px-3 2xsm:w-1/2">
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/dashboard");
                      }}
                      className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                  <div className="w-full px-3 2xsm:w-1/2">
                    <button
                      onClick={() => {
                        setOpen(false);
                        resetParams();
                        navigate("/auditorium/bookings/create");
                      }}
                      className="block w-full rounded border border-primary-500 bg-primary-500 p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                    >
                      Book Again
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    resetParams();
                    navigate("/auditorium/bookings/create");
                  }}
                  className="absolute top-6 right-6 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-primary-500 transition hover:bg-primary-500 hover:text-white"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                      className="fill-current stroke-current"
                    ></path>
                  </svg>
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SuccessModal;
