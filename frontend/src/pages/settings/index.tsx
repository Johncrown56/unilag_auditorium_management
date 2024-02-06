import React from "react";
import Breadcrumb from "../../components/Breadcrumb";

type Props = {};

const Settings = (props: Props) => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Settings" />
    </div>
  );
};

export default Settings;