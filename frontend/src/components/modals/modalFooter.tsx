import React from "react";
import { IModalMode } from "../../utils/interfaces";

type Props = {
  setShowModal: (value: boolean) => void;
  onSubmit?: () => void;
  id: string;
  isLoading: boolean;
  mode: IModalMode;
  submitText: string;
};

const ModalFooter = (props: Props) => {
  const { id, onSubmit, setShowModal, isLoading, mode, submitText } = props;
  return (
    <>
    {mode === "alert" && (
      <div className="-mx-3 flex flex-wrap gap-y-4">
      <div className="w-full px-3 2xsm:w-1/2">
        <button
          className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
          onClick={() => setShowModal(false)}
        >
          Close
        </button>
      </div>
      <div className="w-full px-3 2xsm:w-1/2">
        <button
          disabled={isLoading}
          className={`${
            isLoading ? "" : ""
          } block w-full rounded border border-meta-1 bg-meta-1 p-3 text-center font-medium text-white transition hover:bg-opacity-90`}
          onClick={onSubmit}
        >
          {submitText}
        </button>
      </div>
    </div>
    )}
    </>    
  );
};

export default ModalFooter;
