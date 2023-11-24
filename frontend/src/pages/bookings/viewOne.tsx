import React from "react";
import Breadcrumb from "../../components/Breadcrumb";

type Props = {};

const ViewBookingOne = (props: Props) => {
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="View Booking Details" />
    </div>
  );
};

export default ViewBookingOne;
