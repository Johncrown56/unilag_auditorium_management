import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IBoolean, IFeat, IMode } from '../../../utils/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { toast } from 'react-toastify';
import ButtonLoader from '../../../components/buttonLoader';
import { categoryValidationSchema } from '../validations';
import { create, reset, update } from '../../../features/categories/categorySlice';

type Props = {
    form: any;
    mode: IMode;
    FormName: string;
    setOpenModal: (value: boolean) => void;
    setFormSubmitted: (value: boolean) => void;
}
interface IParams extends IFeat {
    [key: string]: string | undefined;
}

const CategoryForm = (props: Props) => {
    const { form, mode, FormName, setOpenModal, setFormSubmitted } = props;
    const initialValue = { name: "", description: ""};
    const [formData, setFormData] = useState<IParams>(initialValue);
    const [formErrors, setFormErrors] = useState<IParams>(initialValue);
    const [touched, setTouched] = useState<IBoolean>({name: false, description: false});
    const [disabled, setDisabled] = useState(true);
    const dispatch = useDispatch<AppDispatch>();

    const { name, description } = formData;
    const { data: submittedData, isLoading, isError, isSuccess, message } = useSelector(
        (state: RootState) => state.category
    );

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(formData)
        mode === "Edit" ? dispatch(update(formData)) : dispatch(create(formData));
    };

    const onFocus = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
    };

    const onReset = () => {
        setFormData(initialValue);
    };

    useEffect(() => {
        if (form) {
            const values = {id: form?.id, name: form?.name, description: form?.description};
           setFormData(values)
        } else {
            setFormData(initialValue)
        }
    }, [form])

    useEffect(() => {
        categoryValidationSchema
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

        categoryValidationSchema
            .isValid(formData)
            .then((valid) => setDisabled(!valid));
    }, [formData]);

    useEffect(() => {
        if (isError) {
            setOpenModal(false);
            toast.error(message);
        }

        if (isSuccess && submittedData != null) {
            setOpenModal(false)
            onReset()
            message !== "" && toast.success(message);
            setFormSubmitted(true);
        }

        dispatch(reset());
    }, [submittedData, isError, isSuccess, message, dispatch]);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{FormName} Name</label>
                        <input type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={onChange}
                            onFocus={onFocus}
                            readOnly={mode=== "View"? true : false}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            required={true} />
                        <small className="form-error">
                            {touched.name && formErrors.name}
                        </small>
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{FormName} Description</label>
                        <textarea id="description"
                            name='description'
                            value={description}
                            rows={4}
                            onChange={onChange}
                            onFocus={onFocus}
                            readOnly={mode=== "View"? true : false}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Feature description"></textarea>
                        <small className="form-error">
                            {touched.description && formErrors.description}
                        </small>
                    </div>
                </div>
                {mode !== "View" && (
                <div className="flex justify-end gap-4.5">
                    <button
                        className="resetButton"
                        type="button"
                        onClick={onReset}
                    >
                        Reset
                    </button>
                    <button className={`${isLoading || disabled ? "disabled" : ""} protectedSubmitButton`} type="submit" disabled={isLoading || disabled}>
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
    )
}

export default CategoryForm;