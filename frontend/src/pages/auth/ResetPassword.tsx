import { ChangeEvent, FormEvent, FormEventHandler, MouseEvent, useEffect, useState } from "react";
import { IBoolean, IResetPassword, IString } from "../../utils/interfaces";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { reset, resetPassword } from "../../features/auth/authslice";
import ButtonLoader from "../../components/buttonLoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPasswordValidationSchema } from "./validation";

type Props = {}

const ResetPassword = () => {
    const initialValue = { password: "", confirmPassword: "" };
    // Get the search string from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [formData, setFormData] = useState<IResetPassword>(initialValue);
    const [errors, setErrors] = useState<IString>(initialValue);
    const [touched, setTouched] = useState<IBoolean>({
        password: false,
        confirmPassword: false,
    });
    const [disabled, setDisabled] = useState(true);
    const [type, setType] = useState<IString>({
        type1: "password",
        type2: "password",
    });
    const { type1, type2, } = type;

    const { password, confirmPassword } = formData;
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state: RootState) => state.auth
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

    const changePasswordType = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const button: HTMLButtonElement = e.currentTarget;
        setType((prevState) => ({
            ...prevState,
            [button.name]: type[button.name] === "password" ? "text" : "password",
        }));
    };

    const onSubmit: FormEventHandler<HTMLFormElement> = (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        const newFormData = { ...formData, token: token as string, email: email as string }
        console.log(newFormData);
        dispatch(resetPassword(newFormData));
    };

    useEffect(() => {
        resetPasswordValidationSchema
            .validate(formData, { abortEarly: false })
            .then(() => {
                setErrors(initialValue);
            })
            .catch((err: any) => {
                const errors: IResetPassword = initialValue;
                err.inner.forEach((error: any) => {
                    if (touched[error.path]) errors[error.path] = error.message;
                });
                setErrors(errors);
            });

        resetPasswordValidationSchema
            .isValid(formData)
            .then((valid) => setDisabled(!valid));
    }, [formData]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess && user) {
            toast.success(message);
            setTimeout(() => {
            navigate("/login");
            }, 5000);
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, dispatch]);

    return (
        <>
            <main className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
                    <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                        <h2 className="mb-1 text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Reset Password
                        </h2>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={onSubmit}>
                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                <div className="w-full sm:w-full">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="password"
                                    >
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary-500"
                                            type={type1}
                                            name="password"
                                            id="password"
                                            value={password}
                                            onChange={onChange}
                                            onFocus={onFocus}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                                            <button type="button" name="type1" onClick={changePasswordType}>
                                                {type1 === "password" ? <FaEyeSlash className="text-black dark:text-white" /> : <FaEye className="text-black dark:text-white" />}
                                            </button>
                                        </div>
                                    </div>
                                    <small className="form-error">{touched.password && errors.password}</small>
                                </div>

                            </div>


                            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                <div className="w-full sm:w-full">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="phone"
                                    >
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary-500"
                                            type={type2}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={onChange}
                                            onFocus={onFocus}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                                            <button type="button" name="type2" onClick={changePasswordType}>
                                                {type2 === "password" ? <FaEyeSlash className="text-black dark:text-white" /> : <FaEye className="text-black dark:text-white" />}
                                            </button>
                                        </div>
                                    </div>
                                    <small className="form-error">{touched.confirmPassword && errors.confirmPassword}</small>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={disabled || isLoading}
                                className={`${isLoading || disabled ? "disabled" : " "
                                    } submitButton`}
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
                                    to="/login"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Login
                                </Link>
                            </p>
                        </form>

                    </div>
                </div>
            </main>
        </>
    );
};

export default ResetPassword