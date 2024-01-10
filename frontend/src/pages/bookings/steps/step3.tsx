import React, { ChangeEvent, Fragment, useState } from "react";
import {
  AuditoriumResponse,
  IBooking,
  IBookingBoolean,
  ICustomSelect,
  IStepFormState,
} from "../../../utils/interfaces";
import { NumericFormat } from "react-number-format";
import { TbCurrencyNaira } from "react-icons/tb";
import Select from "react-select";
import moment from "moment";
import { paymentOptions } from "../../../constants";

interface Props extends IStepFormState {
  params: IBooking;
  touched: IBookingBoolean;
  handleSelectChange: (value: ICustomSelect) => void;
  auditoriums: AuditoriumResponse[];
  allFeatures: Array<any>;
  eventCategories: Array<any>;
  onSelectFocus: (name: string) => void;
  onBlur?: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

const Step3 = (props: Props) => {
  const {
    currentStep,
    params,
    allFeatures,
    touched,
    formErrors,
    auditoriums,
    eventCategories,
    handleSelectChange,
    onSelectFocus,
    onBlur,
  } = props;

  const { name, type, purpose, remarks, start, end, paymentMethod, features } =
    params;

  const handleStateChange = (selectedOption: any) => {
    console.log(selectedOption);
    handleSelectChange({ value: selectedOption, name: "paymentMethod" });
  };

  const getFeatureNames = (featureIds: any, allFeatures: any) => {
    return featureIds
      .map((id: number) => {
        const feature = allFeatures.find((f: any) => f.featureID === id);
        return feature ? feature.name : null;
      })
      .filter((name: any) => name !== null);
  };

  const newFeatures = getFeatureNames(features, allFeatures);

  const selectedCategory = eventCategories.filter(
    (c: any) => c.id == Number(type)
  )[0];

  const values = [
    {
      name: "Auditorium Details",
      value: [
        {
          key: "Auditorium Name",
          value: name?.label,
        },
        {
          key: "Purpose",
          value: purpose,
        },
        {
          key: "Event Category",
          value: selectedCategory?.name,
        },
        {
          key: "Remarks",
          value: remarks,
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
          value: `${moment(start?.date).format("DD MMMM YYYY")} ${moment(
            start?.time
          ).format("HH:mm:ss")}`,
        },
        {
          key: "End Date",
          value: `${moment(end?.date).format("DD MMMM YYYY")} ${moment(
            end?.time
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
      {/* <div className="border-b border-stroke pb-4 px-7 dark:border-strokedark">
        <h3 className="font-medium text-center text-black dark:text-white">
          Review Booking
        </h3>
      </div> */}
      <div className="py-0">
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
              {"Select Payment Method"}
            </span>
          </div>

          <div className="">
            <div className="relative z-10 bg-gray-100 rounded-md items-center mb-1 dark:bg-form-input">
              <Select
                classNamePrefix="react-select"
                isSearchable={false}
                className=""
                value={paymentMethod}
                id="paymentMethod"
                name="paymentMethod"
                options={paymentOptions}
                onChange={handleStateChange}
                onFocus={() => onSelectFocus("paymentMethod")}
                onBlur={onBlur}
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
                      <span className="dark:text-dark">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold dark:text-white">
                      {/* {item.amount} */}
                    </span>
                  </div>
                )}
              />
              <small className="form-error">
                {touched.paymentMethod && formErrors.paymentMethod}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
