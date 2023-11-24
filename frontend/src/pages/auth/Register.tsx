import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import logo from "../../assets/imgs/unilag-logo-text.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register, reset } from "../../features/auth/authslice";
import ButtonLoader from "../../components/buttonLoader";
import { AppDispatch } from "../../store/store";
import { IBoolean, IRegister, IString } from "../../utils/interfaces";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerValidationSchema } from "./validation";
import { HiChevronDown } from "react-icons/hi";
import { userCategories } from "../../constants";

type Props = {};

const Register = (props: Props) => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userCategory: "",
    userCategoryId: "",
    password: "",
    confirmPassword: "",
    terms: false,
  };
  const [formData, setFormData] = useState<IRegister>(initialValues);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<IString>({
    type1: "password",
    type2: "password",
  });
  const [errors, setErrors] = useState<IRegister>(initialValues);
  const [disabled, setDisabled] = useState(true);
  const [touched, setTouched] = useState<IBoolean>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    userCategory: false,
    userCategoryId: false,
    confirmPassword: false,
    terms: false,
  });
  const { type1, type2 } = type;

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const {
    firstName,
    lastName,
    email,
    phone,
    userCategory,
    userCategoryId,
    password,
    confirmPassword,
    terms,
  } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user != null) {
      message !== "" && toast.success(message);
      navigate("/dashboard", {
        state: { from: location?.pathname },
        replace: true,
      });
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target?.checked,
    }));
  };

  const onFocus = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!terms) {
      toast.error("Please accept the terms and conditions");
    } else if (password !== confirmPassword) {
      toast.error("Password does not match");
    } else {
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        password,
        terms,
        userCategory,
        userCategoryId,
        role: "user",
      };
      console.log(userData);
      dispatch(register(userData));
    }
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
    registerValidationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        setErrors(initialValues);
      })
      .catch((err: any) => {
        const errs: IRegister = initialValues;
        err.inner.forEach((error: any) => {
          if (touched[error.path]) errs[error.path] = error.message;
        });
        setErrors(errs);
      });

    registerValidationSchema
      .isValid(formData)
      .then((valid) => setDisabled(!valid));
  };

  const onBlur = () => {
    validate();
  };

  useEffect(() => {
    validate();
  }, [formData]);

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 pt-16 mx-auto my-auto md:h-full pt:mt-0 dark:bg-gray-900">
        {/* Card */}
        <div className="w-full max-w-xl p-6 my-8 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <form className="mt-8 space-y-6" action="/" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  value={firstName}
                />
                <small className="form-error">
                  {touched.firstName && errors.firstName}
                </small>
              </div>
              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  value={lastName}
                />
                <small className="form-error">
                  {touched.lastName && errors.lastName}
                </small>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  value={email}
                />
                <small className="form-error">
                  {touched.email && errors.email}
                </small>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="08031199202"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  value={phone}
                />
                <small className="form-error">
                  {touched.phone && errors.phone}
                </small>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="userCategory"
                >
                  User Category
                </label>
                <select
                  id="userCategory"
                  name="userCategory"
                  value={userCategory}
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select Category</option>
                  {userCategories.map((uc, i) => (
                    <option key={i} value={uc}>
                      {uc}
                    </option>
                  ))}
                </select>
                <small className="form-error">
                  {touched.userCategory && errors.userCategory}
                </small>
              </div>

              {userCategory === "Student" || userCategory === "Staff" ? (
                <div>
                  <label
                    htmlFor="userCategoryId"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {userCategory === "Student" ? "Matric No" : "Staff Id"}
                  </label>
                  <input
                    type="text"
                    name="userCategoryId"
                    id="userCategoryId"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    value={userCategoryId}
                  />
                  <small className="form-error">
                    {touched.userCategoryId && errors.userCategoryId}
                  </small>
                </div>
              ) : null}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={type1}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    value={password}
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
                  {touched.password && errors.password}
                </small>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={type2}
                    name="confirmPassword"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    value={confirmPassword}
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
                  {touched.confirmPassword && errors.confirmPassword}
                </small>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={terms}
                  className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  onChange={onCheckboxChange}
                  onFocus={onFocus}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="font-medium text-gray-900 dark:text-white"
                >
                  I accept the{" "}
                  <Link
                    to="/terms"
                    className="text-primary-700 hover:underline dark:text-primary-500"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>
            </div>
            <small className="form-error">
              {touched.terms && errors.terms}
            </small>
            <div>
              <button
                type="submit"
                disabled={disabled}
                className={`${
                  isLoading || disabled ? "disabled" : " "
                } submitButton`}
              >
                <ButtonLoader
                  isLoading={isLoading}
                  text="Create account"
                  loadingText="Loading"
                />
              </button>
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-700 hover:underline dark:text-primary-500"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
