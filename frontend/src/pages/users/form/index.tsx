import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IBoolean, IFeat, IMode, IUser } from "../../../utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { toast } from "react-toastify";
import ButtonLoader from "../../../components/buttonLoader";
import { userValidationSchema } from "../validations";
import { roles } from "../../../utils/constant";
import { capitalizeFirstLetter } from "../../../utils/functions";
import { create, reset, update } from "../../../features/admin/adminSlice";

type Props = {
  form: any;
  mode: IMode;
  FormName: string;
  setOpenModal: (value: boolean) => void;
  setFormSubmitted: (value: boolean) => void;
};
interface IParams extends IUser {
  [key: string]: string | undefined;
}

const UserForm = (props: Props) => {
  const { form, mode, FormName, setOpenModal, setFormSubmitted } = props;
  const initialValue = {
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    userCategory: FormName,
    userCategoryId: "",
    phone: ""
  };
  const [formData, setFormData] = useState<IParams>(initialValue);
  const [formErrors, setFormErrors] = useState<IParams>(initialValue);
  const [touched, setTouched] = useState<IBoolean>({
    firstName: false,
    lastName: false,
    role: false,
    email: false,
    userCategory: false,
    userCategoryId: false,
    phone: false
  });
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const { firstName, lastName, role, email, phone, userCategory, userCategoryId } = formData;
  const {
    data: submittedData,
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state: RootState) => state.admin);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
    mode === "Edit" ? dispatch(update(formData)) : dispatch(create(formData));
  };

  const onFocus = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const onBlur = () => {
    validate();
  };

  const onReset = () => {
    setFormData(initialValue);
  };

  useEffect(() => {
    if (form) {
      console.log({ form });
      const {userId, email, firstName, lastName, role, userCategory, userCategoryId, phone} = form
      const values = {userId, email, firstName, lastName, role, userCategory, userCategoryId, phone };
      setFormData(values);
    } else {
      setFormData(initialValue);
    }
  }, [form]);

  const validate = () => {
    userValidationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        setFormErrors(initialValue);
      })
      .catch((err: any) => {
        const errors: IParams = initialValue;
        err.inner.forEach((error: any) => {
          if (touched[error.path]) errors[error.path] = error.message;
        });
        setFormErrors(errors);
      });

    userValidationSchema.isValid(formData).then((valid) => setDisabled(!valid));
  };

  useEffect(() => {
    validate();
  }, [formData]);

  useEffect(() => {
    if (formData !== initialValue) {
      setDisabled(false);
    }
  }, [formData]);

  useEffect(() => {
    if (isError) {
      setOpenModal(false);
      toast.error(message);
    }

    if (isSuccess && submittedData != null) {
      setOpenModal(false);
      onReset();
      message !== "" && toast.success(message);
      setFormSubmitted(true);
    }

    dispatch(reset());
  }, [submittedData, isError, isSuccess, message, dispatch]);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {FormName} First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              readOnly={mode === "View" ? true : false}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required={true}
            />
            <small className="form-error">
              {touched.firstName && formErrors.firstName}
            </small>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {FormName} Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              readOnly={mode === "View" ? true : false}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required={true}
            />
            <small className="form-error">
              {touched.lastName && formErrors.lastName}
            </small>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {FormName} Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              readOnly={mode === "View" ? true : false}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required={true}
            />
            <small className="form-error">
              {touched.email && formErrors.email}
            </small>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {FormName} Phone Number
            </label>
            <input
              type="phone"
              name="phone"
              id="phone"
              value={phone}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              readOnly={mode === "View" ? true : false}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required={true}
            />
            <small className="form-error">
              {touched.phone && formErrors.phone}
            </small>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="userCategoryId"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {FormName} User Id
            </label>
            <input
              type="userCategoryId"
              name="userCategoryId"
              id="userCategoryId"
              value={userCategoryId}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              readOnly={mode === "View" ? true : false}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required={FormName === "Staff" || FormName === "Admin" ? true : false}
            />
            <small className="form-error">
              {touched.userCategoryId && formErrors.userCategoryId}
            </small>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {FormName} Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              disabled={mode === "View" ? true : false}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="">Select Role</option>
              {roles.map((uc, i) => (
                <option key={i} value={uc}>
                  {capitalizeFirstLetter(uc)}
                </option>
              ))}
            </select>
            <small className="form-error">
              {touched.role && formErrors.role}
            </small>
          </div>
        </div>
        {mode !== "View" && (
          <div className="flex justify-end gap-4.5">
            <button className="resetButton" type="button" onClick={onReset}>
              Reset
            </button>
            <button
              className={`${
                isLoading || disabled ? "disabled" : ""
              } protectedSubmitButton`}
              type="submit"
              disabled={isLoading || disabled}
            >
              <ButtonLoader
                isLoading={isLoading}
                text="Submit"
                loadingText="Loading"
              />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserForm;
