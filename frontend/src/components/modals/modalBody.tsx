import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalBody = (props: Props) => {
  const { children } = props;
  return (
    <div>
      <p className="mb-10">{children}</p>
    </div>
  );
};

export default ModalBody;
