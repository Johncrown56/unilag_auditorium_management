import { ReactNode } from "react";
import ModalContainer from "./modalContainer";
import { IResponseType } from "../../utils/interfaces";

type Props = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  id?: string;
  title: string;
  body: ReactNode;
  type: IResponseType;
  onSubmit: () => void;
  isLoading: boolean;
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
    />
  );
};

export default Modal;
