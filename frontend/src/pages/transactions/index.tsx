import React from "react";
import Breadcrumb from "../../components/Breadcrumb";

type Props = {};

const TransactionHistory = (props: Props) => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="TransactionHistory" />
    </div>
  );
};

export default TransactionHistory;
