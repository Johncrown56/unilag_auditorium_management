import React from "react";
import { NumericFormat } from "react-number-format";
import { AuditoriumResponse, IBooking } from "../../utils/interfaces";
import { useSelector } from "react-redux";

type Props = {
  params: IBooking;
  auditoriums: AuditoriumResponse[];
};

const PaymentReview = (props: Props) => {
  const { params, auditoriums } = props;
  const selectedAuditorium = auditoriums.filter(
    (a: any) => a.audID === params?.name?.value
  )[0];

  const { user } = useSelector((state: any) => state.auth);

  const prices = [
    {
      label: "Fee",
      amount:
        selectedAuditorium?.price != undefined
          ? user?.userCategory === "Student"
            ? selectedAuditorium?.studentPrice
            : selectedAuditorium?.price
          : 0,
    },
    {
      label: "VAT (7.5%)",
      amount:
        selectedAuditorium?.vat != undefined ? selectedAuditorium?.vat : 0,
    },
    {
      label: "Caution Fee (Refundable)",
      amount:
        selectedAuditorium?.cautionFee != undefined
          ? selectedAuditorium?.cautionFee
          : 0,
    },
    {
      label: "Cleaning Charges",
      amount:
        selectedAuditorium?.cleaningCharges != undefined
          ? selectedAuditorium?.cleaningCharges
          : 0,
    },
  ];

  // Calculate the sum of the amounts
  const calculateTotalAmount = (prices: any) => {
    return prices.reduce(
      (sum: any, item: any) => Number(sum) + parseFloat(item.amount || 0),
      0
    );
  };

  const totalAmount = calculateTotalAmount(prices);

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-graylight px-0 py-6 sm:p-6 col-span-5 lg:mt-0 lg:p-6 border-stroke dark:border-strokedark dark:bg-boxdark"
    >
      <div className="dark:border-strokedark">
        <h2
          id="summary-heading"
          className="text-lg font-medium text-black dark:text-white"
        >
          Payment summary
        </h2>
      </div>

      <dl className="mt-1 m-0">
        {prices.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-t border-gray-200 px-0 py-6 sm:px-0"
          >
            <dt className="flex items-center text-sm text-black dark:text-white">
              <span>{item.label}</span>
            </dt>
            <dd className="text-sm font-medium text-black dark:text-white">
              <NumericFormat
                value={Number(item.amount).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₦"}
              />
            </dd>
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-gray-200 px-0 py-6 sm:px-0">
          <dt className="text-base font-medium text-black dark:text-white">
            Total
          </dt>
          <dd className="text-base font-medium text-black dark:text-white">
            <NumericFormat
              value={Number(totalAmount).toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₦"}
            />
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default PaymentReview;
