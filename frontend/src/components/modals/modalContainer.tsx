import { ReactNode } from "react";
import ModalTitle from "./modalTitle";
import ModalBody from "./modalBody";
import ModalFooter from "./modalFooter";
import ModalHeader from "./modalHeader";
import { IModalMode, IResponseType } from "../../utils/interfaces";

type Props = {
  showModal: boolean;
  id: string;
  title: string;
  body: ReactNode;
  type?: IResponseType;
  isLoading: boolean;
  mode: IModalMode;
  setShowModal: (value: boolean) => void;
  onSubmit?: () => void;
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
    mode,
  } = props;
  return (
    <div
      // onClick={() => setShowModal(false)}
      className={`${
        showModal ? "visible bg-black/20 z-999999" : "invisible"
      } transition-colors flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none`}
    >
      <div className="relative z-30">
        <div className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className={`${ mode === "form" ? "" : "p-44 text-center"} flex min-h-full items-center justify-center `}>
            <div className={`${ mode === "form" ? "" : "text-center"} w-full max-w-142.5 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-10 md:px-10`}>
              <ModalHeader type={type} setShowModal={setShowModal} />
              <ModalTitle>{title}</ModalTitle>
              <ModalBody>{body}</ModalBody>
              <ModalFooter
                id={id}
                setShowModal={setShowModal}
                onSubmit={onSubmit}
                isLoading={isLoading}
                mode={mode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
