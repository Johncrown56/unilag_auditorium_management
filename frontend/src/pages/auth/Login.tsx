import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../../features/auth/authslice";
import ButtonLoader from "../../components/buttonLoader";
import logo from "../../assets/imgs/unilag-logo-text.png";
import { IBoolean, ILogin } from "../../utils/interfaces";
import { AppDispatch } from "../../store/store";
import { loginValidationSchema } from "./validation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {};

const Login = (props: Props) => {
  const initialValue = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState<ILogin>(initialValue);
  const [formErrors, setFormErrors] = useState<ILogin>(initialValue);
  const [touched, setTouched] = useState<IBoolean>({
    email: false,
    password: false,
  });
  const [disabled, setDisabled] = useState(true);
  const [passwordType, setPasswordType] = useState("password");
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  //const from = location?.state?.from;

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user != null) {
      message !== "" && toast.success(message);
      navigate(
        location?.state?.from != null ? location?.state?.from : "/dashboard",
        {
          state: { from: location?.pathname },
          replace: true,
        }
      );
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  useEffect(() => {
    // yup.reach(validationSchema)
    loginValidationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        setFormErrors(initialValue);
      })
      .catch((err: any) => {
        const errors: ILogin = initialValue;
        err.inner.forEach((error: any) => {
          if (touched[error.path]) errors[error.path] = error.message;
        });
        setFormErrors(errors);
      });

    loginValidationSchema
      .isValid(formData)
      .then((valid) => setDisabled(!valid));
  }, [formData]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  const onFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
        {/* <Link
          to="/"
          className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
        >
          <img src={logo} className="mr-4 h-11" alt="Unilag Logo" />
        </Link> */}
        {/*  Card */}
        <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign in
          </h2>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={onChange}
                  onFocus={onFocus}
                />
                <small className="form-error">
                  {touched.email && formErrors.email}
                </small>
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordType}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  onChange={onChange}
                  onFocus={onFocus}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordType(
                        passwordType === "password" ? "text" : "password"
                      )
                    }
                  >
                    {passwordType === "password" ? (
                      <FaEyeSlash className="dark:text-white" />
                    ) : (
                      <FaEye className="dark:text-white" />
                    )}
                  </button>
                </div>
              </div>

              <small className="form-error">
                {touched.password && formErrors.password}
              </small>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  name="remember"
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="remember"
                  className="font-medium text-gray-900 dark:text-white"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
              >
                Lost Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={disabled}
              className={`${
                isLoading || disabled ? "disabled" : " "
              } submitButton`}
            >
              <ButtonLoader
                isLoading={isLoading}
                text="Login"
                loadingText="Loading"
              />
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Not registered?{" "}
              <Link
                to={"/register"}
                className="text-primary-700 hover:underline dark:text-primary-500"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
