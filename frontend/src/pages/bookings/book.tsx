import React, {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import Breadcrumb from "../../components/Breadcrumb";
import {
  IBooleanDate,
  ICustomSelect,
  IDateFocus,
  IDateProps,
  IFeature,
  IFormState,
  IReactSelect,
  IStep,
  IString,
} from "../../utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
import { fetch, reset } from "../../features/auditoriums/auditoriumSlice";
import ButtonLoader from "../../components/buttonLoader";
import api, { useNavigateAndClearToken } from "../../utils/http";
import moment from "moment";
import {
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema,
} from "./validations";
import { setNestedProperty } from "../../utils/functions";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import PaymentReview from "../auditorium/review";
import SuccessModal from "../../components/modals/success";
import {
  create,
  reset as resetBooking,
} from "../../features/bookings/bookingSlice";

type Props = {};

const BookAuditorium = (props: Props) => {
  const initialValues = {
    name: { value: "", label: "" },
    remarks: "",
    purpose: "",
    features: [],
    type: 0,
    approved: false,
    paymentStatus: false,
    start: { date: null, time: null },
    end: { date: null, time: null },
  };
  const initialTouched = {
    name: false,
    purpose: false,
    remarks: false,
    type: false,
    start: { date: false, time: false },
    end: { date: false, time: false },
  };
  const totalSteps = 3;

  const generateInitialDisabled = () => {
    const initialDisabled: IStep = {};
    for (let step = 1; step <= totalSteps; step++) {
      initialDisabled[`step${step}`] = true;
    }
    return initialDisabled;
  };

  const initialState = {
    mount: false,
    currentStep: 1,
    params: initialValues,
    formErrors: {},
    touched: initialTouched,
    disabled: generateInitialDisabled(),
  };

  const [formState, setFormState] = useState<IFormState>(initialState);

  const [allFeatures, setAllFeatures] = useState<IFeature[]>([]);
  const [categories, setCategories] = useState<Array<any>>([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: <span></span>,
    status: false,
    data: {},
  });
  const { mount, currentStep, params, formErrors, touched, disabled } =
    formState;

  const dispatch = useDispatch<AppDispatch>();
  const navigateAndClearToken = useNavigateAndClearToken();

  const {
    data: data1,
    type: type1,
    isLoading: isLoading1,
    isError: isError1,
    isSuccess: isSuccess1,
    message: message1,
  } = useSelector((state: any) => state.auditorium);

  const {
    data: data2,
    type: type2,
    isLoading: isLoading2,
    isError: isError2,
    isSuccess: isSuccess2,
    message: message2,
  } = useSelector((state: any) => state.booking);

  useEffect(() => {
    setFormState((prevState) => ({ ...prevState, mount: true }));
  }, []);

  useEffect(() => {
    console.log(formState.params);
  }, [formState.params]);

  const customSetState = (name: string, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      params: { ...prevState.params, [name]: value },
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    customSetState(name, value);
  };

  const handleSelectChange = (props: ICustomSelect) => {
    const { name, value } = props;
    customSetState(name, value);
  };

  const handleArrayChange = (props: {
    name: string;
    value: IReactSelect[];
  }) => {
    const { name, value } = props;
    console.log(value);
    setFormState((prevState) => ({
      ...prevState,
      params: {
        ...prevState.params,
        [name]: value.map((option) => option.value),
      },
    }));
  };

  const handleDateChange = (props: IDateProps) => {
    const { name, type, value } = props;
    setFormState((prevState) => ({
      ...prevState,
      params: {
        ...prevState.params,
        [name]: { ...(prevState.params[name] as {}), [type!]: value },
      },
    }));
  };

  const onFocus = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setFormState((prevTouched) => ({
      ...prevTouched,
      touched: { ...prevTouched.touched, [name]: true },
    }));
  };

  const onDateFocus = (props: IDateFocus) => {
    const { e, name, type } = props;
    setFormState((prevState) => ({
      ...prevState,
      touched: {
        ...prevState.touched,
        [name]: {
          ...(prevState.touched[name] as IBooleanDate),
          [type!]: true,
        },
      },
    }));
  };

  const onSelectFocus = (name: string) => {
    setFormState((prevState) => ({
      ...prevState,
      touched: {
        ...prevState.touched,
        [name]: true,
      },
    }));
  };

  useEffect(() => {
    dispatch(fetch());
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isError1) {
      toast.error(message1);
    }
    if (isSuccess1 && data1 != null) {
      setAuditoriums(data1);
    }
    dispatch(reset());
  }, [data1, isError1, isSuccess1, message1, dispatch]);

  useEffect(() => {
    console.log(type2);
    if (isError2) {
      toast.error(message2);
    }
    if (isSuccess2 && data2 != null) {
      // && type2 === "booking/create/fulfilled"
      // if response is Success
      //toast.success(message2);
      const msg = (
        <span>
          You have booked{" "}
          <span className="text-black font-bold"> {data2?.name} </span>{" "}
          Auditorium successfully. We’ve sent you an email with all of the
          details of your booking. Please kindly note that your booking is
          subject to approval by the University Auditorium Commitee Chairman.
        </span>
      );
      const title1 = `${message2}`;
      const title = "Congratulations!!!";
      openModal(title, msg, isSuccess2, data2);
    }
    dispatch(resetBooking());
  }, [data2, isError2, isSuccess2, message2, dispatch]);

  const fetchCategories = async () => {
    try {
      const url = "/api/events";
      const response = await api.get(url);
      console.log(response.data);
      setCategories(response.data.data);
    } catch (error: any) {
      console.log(error);
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        // Handle token expiration, e.g., redirect to the login page
        navigateAndClearToken();
      } else {
        toast.error("Categories could not be fetched");
      }
    }
  };

  const next = () => {
    const { currentStep } = formState;
    setFormState((prevState: any) => ({
      ...prevState,
      currentStep: currentStep >= totalSteps - 1 ? totalSteps : currentStep + 1,
    }));
  };

  const prev = () => {
    const { currentStep } = formState;
    setFormState((prevState) => ({
      ...prevState,
      currentStep: currentStep <= 1 ? 1 : currentStep - 1,
    }));
  };

  const previousButton = () => {
    const { currentStep } = formState;
    if (currentStep !== 1) {
      return (
        <button className="resetButton" type="button" onClick={prev}>
          Previous
        </button>
      );
    }
    return null;
  };

  const nextButton = () => {
    const { currentStep, disabled } = formState;
    const stepDisabled = disabled[`step${currentStep}`] || false;
    if (currentStep < totalSteps) {
      return (
        <button
          disabled={stepDisabled}
          className={`${stepDisabled ? "disabled" : ""} protectedSubmitButton`}
          type="button"
          onClick={next}
        >
          Next
        </button>
      );
    }
    return null;
  };

  const submitButton = () => {
    const { currentStep } = formState;
    if (currentStep === totalSteps) {
      return (
        <button
          className={`${isLoading2 ? "disabled" : ""} protectedSubmitButton`}
          disabled={isLoading2}
          type="submit"
        >
          <ButtonLoader
            isLoading={isLoading2}
            text="Submit"
            loadingText="Loading"
          />
        </button>
      );
    }
    return null;
  };

  const checkValidTime = (time: Date) => {
    const isBetween7AMand6PM = moment(time).isBetween(
      moment(time).set({ hour: 7, minute: 0, second: 0 }),
      moment(time).set({ hour: 18, minute: 0, second: 0 }),
      null,
      "[]"
    );
    return isBetween7AMand6PM ? true : false;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { date: endDate, time: endTime } = formState.params.end;
    const { date: startDate, time: startTime } = formState.params.start;

    if (moment(endDate).isBefore(moment(startDate))) {
      toast.error("End date must be greater than start date.");
    } else if (!checkValidTime(startTime!)) {
      toast.error("Start time must be between 7AM and 6PM.");
    } else if (!checkValidTime(endTime!)) {
      toast.error("End Time must be between 7AM and 6PM.");
    } else {
      console.log(formState);
      const {
        name,
        purpose,
        remarks,
        start,
        end,
        type,
        features,
        approved,
        paymentStatus,
      } = params;
      const values = {
        name,
        audId: name?.value,
        purpose,
        remarks,
        start,
        end,
        type,
        features,
        approved,
        paymentStatus,
      };
      dispatch(create(values));
    }
  };

  const validateForm = async () => {
    const validationSchemas = {
      1: step1ValidationSchema,
      2: step2ValidationSchema,
      3: step3ValidationSchema,
    };
    const validationSchema =
      validationSchemas[currentStep as keyof typeof validationSchemas] ||
      step1ValidationSchema;

    try {
      await validationSchema.validate(params, { abortEarly: false });
      // If validation succeeds, clear form errors
      setFormState((prevState) => ({ ...prevState, formErrors: {} }));
    } catch (errors: any) {
      const formErrors: IString = {};
      errors.inner.forEach((error: any) => {
        // Flatten the error messages to match the structure of the state
        setNestedProperty(formErrors, error.path, error.message);
      });
      // Update the state with the form errors
      setFormState((prevState) => ({ ...prevState, formErrors }));
      // Validation failed
    }

    validationSchema.isValid(params).then((valid) =>
      setFormState((prevState) => ({
        ...prevState,
        disabled: {
          ...disabled,
          [`step${currentStep}`]: !valid,
        },
      }))
    );
  };

  useEffect(() => {
    validateForm();
  }, [params]);

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = (
    title: string,
    message: ReactElement,
    status: boolean,
    data: any
  ) => {
    setOpen(true);
    setModalContent({ title, message, status, data });
  };

  const resetParams = () => {
    setFormState(initialState);
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Book Auditorium" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-7 xl:col-span-3">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Book Auditorium
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <Step1
                    currentStep={currentStep}
                    params={params}
                    formErrors={formErrors}
                    touched={touched}
                    disabled={disabled}
                    auditoriums={auditoriums}
                    allFeatures={allFeatures}
                    eventCategories={categories}
                    setAllFeatures={setAllFeatures}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    onSelectFocus={onSelectFocus}
                    onMultiSelectChange={handleArrayChange}
                    onFocus={onFocus}
                  />
                  <Step2
                    currentStep={currentStep}
                    params={params}
                    formErrors={formErrors}
                    touched={touched}
                    disabled={disabled}
                    handleDateChange={handleDateChange}
                    onDateFocus={onDateFocus}
                    handleChange={handleChange}
                    onFocus={onFocus}
                  />
                  <Step3
                    currentStep={currentStep}
                    params={params}
                    formErrors={formErrors}
                    touched={touched}
                    disabled={disabled}
                    allFeatures={allFeatures}
                    auditoriums={auditoriums}
                    eventCategories={categories}
                  />

                  <div className="flex justify-end gap-4.5">
                    {previousButton()}
                    {nextButton()}
                    {submitButton()}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <PaymentReview auditoriums={auditoriums} params={params} />
          </div>
        </div>
      </div>
      <SuccessModal
        open={open}
        setOpen={setOpen}
        resetParams={resetParams}
        params={params}
        modalContent={modalContent}
      />
    </>
  );
};

export default BookAuditorium;
