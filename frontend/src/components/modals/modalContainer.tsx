import { ReactNode } from "react";
import ModalTitle from "./modalTitle";
import ModalBody from "./modalBody";
import ModalFooter from "./modalFooter";
import ModalHeader from "./modalHeader";
import { IResponseType } from "../../utils/interfaces";

type Props = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  id: string;
  title: string;
  body: ReactNode;
  type: IResponseType;
  onSubmit: () => void;
  isLoading: boolean;
};

const ModalContainer = (props: Props) => {
  const {
    showModal,
    setShowModal,
    type,
    id,
    title,
    body,
    onSubmit,
    isLoading,
  } = props;
  return (
    <div
      // onClick={() => setShowModal(false)}
      className={`${
        showModal ? "visible bg-black/20" : "invisible"
      } transition-colors flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none`}
    >
      <div className="relative z-30">
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
              <ModalHeader type={type} />
              <ModalTitle>{title}</ModalTitle>
              <ModalBody>{body}</ModalBody>
              <ModalFooter
                id={id}
                setShowModal={setShowModal}
                onSubmit={onSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
