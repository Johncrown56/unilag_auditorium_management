import React, { ChangeEvent, FormEvent, MouseEvent, useState } from 'react'
import { IString } from '../../utils/interfaces';
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {}

const ChangePassword = (props: Props) => {
    const initialValues = {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    };
    const [formState, setFormState] = useState({
        params: initialValues,
        disabled: true,
    });
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

    const changePasswordType = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const button: HTMLButtonElement = e.currentTarget;
        setType((prevState) => ({
            ...prevState,
            [button.name]: type[button.name] === "password" ? "text" : "password",
        }));
    };

    const resetValues = () =>{
        setFormState((prevState) => ({
            ...prevState,
            params: initialValues,
        }));
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(params);
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
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white"
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
                                    type={type3}
                                    name="confirmNewPassword"
                                    id="confirmNewPassword"
                                    value={params.confirmNewPassword}
                                    onChange={handleChange}
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
                        </div>
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                            type="button" onClick={resetValues}
                        >
                            Reset
                        </button>
                        <button
                            className="flex justify-center rounded bg-primary-500 py-2 px-6 font-medium text-white hover:bg-opacity-70"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword