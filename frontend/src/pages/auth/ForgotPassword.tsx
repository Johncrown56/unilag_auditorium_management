import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IBoolean, IForgotPassword, IString } from "../../utils/interfaces";
import { AppDispatch } from "../../store/store";
import { forgotPassword, login, reset } from "../../features/auth/authslice";
import ButtonLoader from "../../components/buttonLoader";
import { forgotPasswordValidationSchema } from "./validation";

const ForgotPassword = () => {
  const initialValue = { email: "" };
  const [formData, setFormData] = useState<IForgotPassword>(initialValue);
  const [errors, setErrors] = useState<IString>(initialValue);
  const [touched, setTouched] = useState<IBoolean>({
    email: false,
    password: false,
  });
  const [disabled, setDisabled] = useState(true);

  const { email } = formData;
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log(formData);
    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    forgotPasswordValidationSchema
      .validate(formData, { abortEarly: false })
      .then(() => {
        setErrors(initialValue);
      })
      .catch((err: any) => {
        const errors: IForgotPassword = initialValue;
        err.inner.forEach((error: any) => {
          if (touched[error.path]) errors[error.path] = error.message;
        });
        setErrors(errors);
      });

    forgotPasswordValidationSchema
      .isValid(formData)
      .then((valid) => setDisabled(!valid));
  }, [formData]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && user) {
      toast.success(message);
      navigate("/reset-password");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, dispatch]);

  return (
    <>
      <h2 className="mb-1 text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Forgot Password
      </h2>
      <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onFocus={onFocus}
            onChange={onChange}
            className="inputClass"
            required={true}
          />
          <small className="form-error">{touched.email && errors.email}</small>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="checkboxClass"
              required={true}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="terms"
              className="font-light text-gray-500 dark:text-gray-300"
            >
              I accept the{" "}
              <Link
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                to="/terms"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={disabled}
          className={`${
            isLoading || disabled ? "disabled" : " "
          } authSubmitButton`}
        >
          <ButtonLoader
            isLoading={isLoading}
            text="Submit"
            loadingText="Loading"
          />
        </button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Remember Password?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export default ForgotPassword;
