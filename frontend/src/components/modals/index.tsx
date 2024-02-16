import { ReactNode } from "react";
import ModalContainer from "./modalContainer";
import { IModalMode, IResponseType } from "../../utils/interfaces";

type Props = {
  showModal: boolean;
  id?: string;
  title: string;
  body: ReactNode;
  type?: IResponseType;
  isLoading: boolean;
  mode: IModalMode;
  onSubmit?: () => void;
  setShowModal: (value: boolean) => void;
};

const Modal = (props: Props) => {
  const {
    type,
    showModal,
    setShowModal,
    id,
    title,
    body,
    onSubmit,
    isLoading,
    mode
  } = props;
  return (
    <ModalContainer
      type={type}
      showModal={showModal}
      setShowModal={setShowModal}
      id={id!}
      title={title}
      body={body}
      onSubmit={onSubmit}
      isLoading={isLoading}
      mode={mode}
    />
  );
};

export default Modal;
