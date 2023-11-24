import React, { ChangeEvent } from "react";
import { BiBookAdd, BiCalendar, BiEdit } from "react-icons/bi";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import {
  AuditoriumResponse,
  IBookingBoolean,
  ICustomSelect,
  IFeature,
  IReactSelect,
  IStepFormState,
} from "../../../utils/interfaces";
import Select from "react-select";

interface Props extends IStepFormState {
  params: Iparams;
  touched: IBookingBoolean;
  auditoriums: AuditoriumResponse[];
  allFeatures: Array<any>;
  eventCategories: Array<any>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (value: ICustomSelect) => void;
  setAllFeatures: (value: IFeature[]) => void;
  onMultiSelectChange: (param: { name: string; value: any }) => void;
  onFocus: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onSelectFocus: (name: string) => void;
  onBlur?: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

type Iparams = {
  name: IReactSelect;
  purpose: string;
  remarks: string;
  type: number;
};

const Step1 = (props: Props) => {
  const {
    currentStep,
    params,
    formErrors,
    touched,
    disabled,
    auditoriums,
    allFeatures,
    eventCategories,
    setAllFeatures,
    handleChange,
    handleSelectChange,
    onSelectFocus,
    onMultiSelectChange,
    onFocus,
    onBlur,
  } = props;
  const { purpose, remarks, type, name } = params;

  const auditoriumOptions = auditoriums.map((item: any) => ({
    value: item.audID,
    label: item.name,
  }));

  const featureOptions = allFeatures.map((item: any) => ({
    value: item.featureID,
    label: item.name,
  }));

  const handleStateChange = (selectedOption: any) => {
    console.log(selectedOption);
    const selectedAuditorium = auditoriums.filter(
      (a) => a.audID === selectedOption.value
    )[0];
    setAllFeatures(selectedAuditorium.features);
    handleSelectChange({ value: selectedOption, name: "name" });
  };

  if (currentStep !== 1) {
    return null;
  }
  return (
    <>
      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <div className="w-full sm:w-1/2">
          <div className="relative">
            <label className="inputLabelClass" htmlFor="name">
              Select Auditorium
            </label>
            <Select
              options={auditoriumOptions}
              value={name}
              id="name"
              name="name"
              placeholder={"Select Auditorium"}
              inputId="name"
              instanceId="names"
              className="basic-multi-select text-sm z-40"
              classNamePrefix="react-select"
              onChange={handleStateChange}
              onFocus={() => onSelectFocus("name")}
              onBlur={onBlur}
            />
            <small className="form-error">
              {touched.name && formErrors.name}
            </small>
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="inputLabelClass" htmlFor="type">
            Event Category
          </label>
          <div className="relative z-20">
            <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
              <BiCalendar className="w-5 h-5 text-greyIcon" />
            </span>
            <select
              id="type"
              name="type"
              value={type}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              className="selectClass"
            >
              <option value="">Select Category</option>
              {eventCategories &&
                eventCategories.map((p, i) => (
                  <option key={i} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>
          <small className="form-error">
            {touched.type && formErrors.type}
          </small>
        </div>
      </div>

      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <div className="w-full sm:w-1/2">
          <label className="inputLabelClass" htmlFor="purpose">
            Purpose of Booking
          </label>
          <div className="relative z-20">
            <span className="absolute left-4.5 top-4">
              <BiBookAdd />
            </span>
            <input
              className="inputClass"
              type="text"
              name="purpose"
              id="purpose"
              value={purpose}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <small className="form-error">
            {touched.purpose && formErrors.purpose}
          </small>
        </div>

        <div className="w-full sm:w-1/2">
          <div className="relative">
            <label className="inputLabelClass" htmlFor="features">
              Features {"(Optional)"}
            </label>
            <Select
              isMulti
              name="features"
              options={featureOptions}
              className="basic-multi-select text-sm"
              classNamePrefix="react-select"
              onChange={(e) =>
                onMultiSelectChange({ name: "features", value: e })
              }
            />
          </div>
        </div>
      </div>

      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <div className="w-full">
          <label className="inputLabelClass" htmlFor="remarks">
            Remarks (Send additional note to the admin)
          </label>
          <div className="relative">
            <span className="absolute left-4.5 top-4">
              <BiEdit />
            </span>
            <textarea
              id="remarks"
              rows={6}
              name="remarks"
              placeholder="Type remarks here..."
              className="inputClass"
              value={remarks}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <small className="form-error">
              {touched.remarks && formErrors.remarks}
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1;
