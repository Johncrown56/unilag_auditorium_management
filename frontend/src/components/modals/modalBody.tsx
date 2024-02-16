import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalBody = (props: Props) => {
  const { children } = props;
  return (
    <div className="mb-10">
    {children}
    </div>
  );
};

export default ModalBody;
