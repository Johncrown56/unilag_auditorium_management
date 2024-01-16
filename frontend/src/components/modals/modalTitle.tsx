import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalTitle = (props: Props) => {
  const { children } = props;
  return (
    <h3 className="mt-5.5 pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
      {children}
    </h3>
  );
};

export default ModalTitle;
