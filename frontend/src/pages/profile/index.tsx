import React from "react";
import Breadcrumb from "../../components/Breadcrumb";

type Props = {};

const Profile = (props: Props) => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Profile" />
    </div>
  );
};

export default Profile;
