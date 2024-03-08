import React, { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { IBoolean, IChangePassword, IString } from "../../utils/interfaces";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changePasswordValidationSchema } from "./validations";
import ButtonLoader from "../buttonLoader";
import { AppDispatch } from "../../store/store";
import { changePassword } from "../../features/profile/profileSlice";

type Props = {
    isLoading: boolean;
    dispatch: AppDispatch;
};

const ChangePassword = (props: Props) => {
    const {isLoading, dispatch} = props;
  const initialValues: IChangePassword = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  const initialTouched = {
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  }
  const [formState, setFormState] = useState({
    params: initialValues,
    disabled: true,
  });
  const [formErrors, setFormErrors] = useState<IString>(initialValues);
  const [touched, setTouched] = useState<IBoolean>(initialTouched);
  const [type, setType] = useState<IString>({
    type1: "password",
    type2: "password",
    type3: "password",
  });

  const { params, disabled } = formState;
  const { type1, type2, type3 } = type;

  const customSetState = (name: string, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      params: { ...prevState.params, [name]: value },
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    customSetState(name, value);
  };

  const onFocus = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const onBlur = () => {
    validate();
  };

  const changePasswordType = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const button: HTMLButtonElement = e.currentTarget;
    setType((prevState) => ({
      ...prevState,
      [button.name]: type[button.name] === "password" ? "text" : "password",
    }));
  };

  const validate = () => {
    changePasswordValidationSchema
      .validate(params, { abortEarly: false })
      .then(() => {
        setFormErrors(initialValues);
      })
      .catch((err: any) => {
        const errors: IString = initialValues;
        err.inner.forEach((error: any) => {
          if (touched[error.path]) errors[error.path] = error.message;
        });
        setFormErrors(errors);
      });

      changePasswordValidationSchema.isValid(params).then((valid) => 
      setFormState((prevState) => ({
        ...prevState,
        disabled: !valid,
      }))
      );
  };

  useEffect(() => {
    validate();
  }, [params]);

  const resetValues = () => {
    setFormState((prevState) => ({
      ...prevState,
      params: initialValues,
    }));
    setTouched(initialTouched);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(changePassword(params));
    resetValues()
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          Change Password
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-full">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="oldPassword"
              >
                Old Password
              </label>
              <div className="relative">
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary-500"
                  type={type1}
                  name="oldPassword"
                  id="oldPassword"
                  value={params.oldPassword}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                  <button
                    type="button"
                    name="type1"
                    onClick={changePasswordType}
                  >
                    {type1 === "password" ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <small className="form-error">
              {touched.oldPassword && formErrors.oldPassword}
            </small>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-full">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary-500"
                  type={type2}
                  name="newPassword"
                  id="newPassword"
                  value={params.newPassword}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                  <button
                    type="button"
                    name="type2"
                    onClick={changePasswordType}
                  >
                    {type2 === "password" ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <small className="form-error">
              {touched.newPassword && formErrors.newPassword}
            </small>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-full">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="confirmNewPassword"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary-500"
                  type={type3}
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  value={params.confirmNewPassword}
                  onChange={handleChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                  <button
                    type="button"
                    name="type3"
                    onClick={changePasswordType}
                  >
                    {type3 === "password" ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <small className="form-error">
              {touched.confirmNewPassword && formErrors.confirmNewPassword}
            </small>
            </div>
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              type="button"
              onClick={resetValues}
            >
              Reset
            </button>
            <button
                      type="submit"
                      disabled={disabled}
                      className={`${
                        isLoading || disabled ? "disabled" : " "
                      } protectedSubmitButton`}
                    >
                      <ButtonLoader
                        isLoading={isLoading}
                        text="Save"
                        loadingText="Loading"
                      />
                      </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
