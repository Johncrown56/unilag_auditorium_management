import React, { Fragment, useState } from "react";
import {
  AuditoriumResponse,
  IBooking,
  IBookingBoolean,
  IStepFormState,
} from "../../../utils/interfaces";
import { NumericFormat } from "react-number-format";
import { TbCurrencyNaira } from "react-icons/tb";
import Select from "react-select";
import moment from "moment";

interface Props extends IStepFormState {
  params: IBooking;
  touched: IBookingBoolean;
  auditoriums: AuditoriumResponse[];
  allFeatures: Array<any>;
  eventCategories: Array<any>;
}

const Step3 = (props: Props) => {
  const paymentOptions = [
    {
      value: "Paystack",
      label: "Paystack",
      color: "bg-blue-400",
    },
    {
      value: "Remita",
      label: "Remita",
      color: "bg-red-400",
    },
  ];
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);
  const handleChange = (option: any) => {
    setPaymentMethod(option);
  };

  const { currentStep, params, allFeatures, auditoriums, eventCategories } =
    props;

  const getFeatureNames = (featureIds: any, allFeatures: any) => {
    return featureIds
      .map((id: number) => {
        const feature = allFeatures.find((f: any) => f.featureID === id);
        return feature ? feature.name : null;
      })
      .filter((name: any) => name !== null);
  };

  const newFeatures = getFeatureNames(params.features, allFeatures);

  const selectedCategory = eventCategories.filter(
    (c: any) => c.id == Number(params.type)
  )[0];

  const values = [
    {
      name: "Auditorium Details",
      value: [
        {
          key: "Auditorium Name",
          value: params.name.label,
        },
        {
          key: "Purpose",
          value: params.purpose,
        },
        {
          key: "Event Category",
          value: selectedCategory?.name,
        },
        {
          key: "Remarks",
          value: params.remarks,
        },
        {
          key: "Features",
          value: newFeatures.join(", "),
        },
      ],
    },
    {
      name: "Date Information",
      value: [
        {
          key: "Start Date",
          value: `${moment(params.start.date).format("DD MMMM YYYY")} ${moment(
            params.start.time
          ).format("HH:mm:ss")}`,
        },
        {
          key: "End Date",
          value: `${moment(params.end.date).format("DD MMMM YYYY")} ${moment(
            params.end.time
          ).format("HH:mm:ss")}`,
        },
      ],
    },
  ];

  if (currentStep !== 3) {
    return null;
  }
  return (
    <div>
      <div className="border-b border-stroke pb-4 px-7 dark:border-strokedark">
        <h3 className="font-medium text-center text-black dark:text-white">
          Review Booking
        </h3>
      </div>
      <div className="py-7">
        {values.map((item: any, i: number) => (
          <div key={i} className="mb-3">
            <div className="mb-2">
              <span className="text-sm font-semibold dark:text-white">
                {item.name}
              </span>
            </div>
            {item.value.map((it: any, id: number) => (
              <Fragment key={id}>
                <div className="p-4 bg-gray-100 rounded-md justify-between items-center flex mb-1 dark:border dark:border-gray-600 dark:bg-form-input">
                  <span className="text-sm font-light dark:text-white">
                    {it.key}
                  </span>
                  <span className="text-sm font-semibold dark:text-white">
                    {!isNaN(it.value) ? (
                      <NumericFormat
                        value={Number(it.value).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₦"}
                      />
                    ) : (
                      it.value
                    )}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        ))}
        <div className="mb-3">
          <div className="mb-2">
            <span className="text-sm font-semibold dark:text-white">
              {"Payment Method"}
            </span>
          </div>

          <div className="">
            <div className="relative z-10 bg-gray-100 rounded-md items-center mb-1 dark:bg-form-input">
              <Select
                classNamePrefix="react-select"
                isSearchable={false}
                className=""
                value={paymentMethod}
                id="paymentOption"
                name="paymentOption"
                onChange={handleChange}
                options={paymentOptions}
                formatOptionLabel={(item: any) => (
                  <div className="justify-between items-center flex">
                    <div className="flex gap-2 items-center">
                      {item.color !== "" && (
                        <div className="">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color} dark:${item.color} `}
                          >
                            <TbCurrencyNaira className="w-5 h-5 text-white" />
                          </span>
                        </div>
                      )}
                      <span className="dark:text-white">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold dark:text-white">
                      {/* {item.amount} */}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
