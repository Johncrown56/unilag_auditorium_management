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
  IPaymentDetails,
  IReactSelect,
  IResponseType,
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
  step4ValidationSchema,
} from "./validations";
import {
  calculateTotalAmount,
  checkValidTime,
  setNestedProperty,
} from "../../utils/functions";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import PaymentReview from "../auditorium/review";
import SuccessModal from "../../components/modals/success";
import {
  create,
  reset as resetBooking,
} from "../../features/bookings/bookingSlice";
import Step4 from "./steps/step4";
import { PaymentSummary } from "../../utils/constant";
import Modal from "../../components/modals";
import { useNavigate } from "react-router-dom";
import endpoint from "../../utils/endpoints";

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
    available: false,
    paymentMethod: { value: "", label: "" },
    receipt: [],
    discount: "",
    start: { date: null, time: null },
    end: { date: null, time: null },
  };
  const initialTouched = {
    name: false,
    purpose: false,
    remarks: false,
    type: false,
    available: false,
    start: { date: false, time: false },
    end: { date: false, time: false },
    paymentMethod: false,
  };
  const totalSteps = 4;
  const titles = {
    1: "Booking Information",
    2: "Date and Time Information",
    3: "Review Booking",
    4: "Make Payment",
  };

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
  const [auditoriums, setAuditoriums] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: JSX.Element;
    status: boolean;
    type: IResponseType;
    data: {};
  }>({
    title: "",
    message: <span></span>,
    status: false,
    type: "success",
    data: {},
  });
  const { mount, currentStep, params, formErrors, touched, disabled } =
    formState;

  const dispatch = useDispatch<AppDispatch>();
  const navigateAndClearToken = useNavigateAndClearToken();
  const navigate = useNavigate();

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

  const { user } = useSelector((state: any) => state.auth);

  const selectedAuditorium = auditoriums.filter(
    (a: any) => a.audID === params?.name?.value
  )[0];

  // Convert date strings to moment objects
  const startDateMoment = params?.start?.date
    ? moment(params?.start?.date)
    : moment();
  const endDateMoment = params?.end?.date
    ? moment(params?.end?.date)
    : moment();

  // Calculate the difference of event days
  const differenceInDays = endDateMoment.diff(startDateMoment, "days") + 1;
  const calculatePriceDiscount =
    (Number(selectedAuditorium?.discount) / 100) *
    Number(selectedAuditorium?.price);

  // Determine the price to show for user
  const price =
    selectedAuditorium?.price != undefined
      ? user?.userCategory === "Student"
        ? Number(selectedAuditorium?.studentPrice) * differenceInDays
        : Number(selectedAuditorium?.discount) > 0
        ? (Number(selectedAuditorium?.price) - calculatePriceDiscount) *
          differenceInDays
        : Number(selectedAuditorium?.price) * differenceInDays
      : 0;

  // show payment summary
  const prices = PaymentSummary(selectedAuditorium, differenceInDays, price);
  const totalAmount = calculateTotalAmount(prices);  
  //totalAmount && setTotalPrice(totalAmount);

  useEffect(() => {
    totalAmount && setTotalPrice(totalAmount);
  }, [prices]);

  const resultObject = prices.reduce((acc: any, item) => {
    acc[item?.key] = item?.value ? item?.value : item?.amount;
    return acc;
  }, {});

  useEffect(() => {
    setFormState((prevState) => ({ ...prevState, mount: true }));
  }, []);

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
    validateEventDate();
  };

  const onCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    customSetState(name, checked);
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
    if (isError2) {
      toast.error(message2);
    }
    if (isSuccess2 && data2 != null) {
      // && type2 === "booking/create/fulfilled"
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
      const type = "success";
      openModal(title, msg, isSuccess2, type, data2);
    }
    dispatch(resetBooking());
  }, [data2, isError2, isSuccess2, message2, dispatch]);

  const fetchCategories = async () => {
    try {
      const url = endpoint.EVENTS;
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
          disabled={stepDisabled || isLoading2}
          className={`${
            stepDisabled || isLoading2 ? "disabled" : ""
          } protectedSubmitButton`}
          type="button"
          onClick={next}
        >
          <ButtonLoader
            isLoading={isLoading2}
            text="Next"
            loadingText="Loading"
          />
        </button>
      );
    }
    return null;
  };

  const submitButton = () => {
    const { currentStep, disabled } = formState;
    const stepDisabled = disabled[`step${currentStep}`] || false;
    if (currentStep === totalSteps) {
      return (
        <button
          className={`${
            isLoading2 || stepDisabled ? "disabled" : ""
          } protectedSubmitButton`}
          disabled={isLoading2 || stepDisabled}
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
      const { cautionFee, cleaningCharges, vat, eventDays } = resultObject;
      const payment: IPaymentDetails = {
        totalAmount: totalPrice,
        cautionFee,
        cleaningCharges,
        vat,
        eventDays: Number(eventDays),
      };
      const values = {
        ...params,
        paymentPlatform: params?.paymentMethod?.value,
        audId: params.name?.value,
        payment,
      };
      console.log(values);
      dispatch(create(values));
    }
  };

  const GetTitle = () => {
    const tit = titles[currentStep as keyof typeof titles];
    return <span>{tit}</span>;
  };

  const validateForm = async () => {
    const validationSchemas = {
      1: step1ValidationSchema,
      2: step2ValidationSchema,
      3: step3ValidationSchema,
      4: step4ValidationSchema,
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

  const validateEventDate = async () => {
    const { name, start, end } = formState.params;
    if (end.date !== null && start.date !== null) {
      try {
        const request = {
          audId: name?.value,
          start,
          end,
        };
        setFormState((prevState) => ({
          ...prevState,
          params: { ...prevState.params, available: false },
        }));
        const response = await api.post("api/bookings/check", request);
        console.log(response.data);
        const { available } = response.data.data;
        setFormState((prevState) => ({
          ...prevState,
          params: { ...prevState.params, available },
          touched: { ...prevState.touched, available: true },
        }));
        await step2ValidationSchema.validate(params, { abortEarly: false });
        if (available == false) {
          toast.error(response.data.message);
        }
      } catch (error: any) {
        console.log(error);
        //toast.error("Error validating date");
      }
    }
    // else {
    //   console.log("Date not set");
    // }
  };

  const openModal = (
    title: string,
    message: ReactElement,
    status: boolean,
    type: IResponseType,
    data: any
  ) => {
    setOpen(true);
    setModalContent({ title, message, status, type, data });
  };

  const resetParams = () => {
    setFormState(initialState);
  };

  const onProceed = () => {
    setOpen(false);
    resetParams();
    navigate("/auditorium/bookings/create");
  };

  const onDiscountClick = () => {
    // call api to validate and process discount
  };
  return (
    <>
      {mount && (
        <>
          <div className="mx-auto max-w-270">
            <Breadcrumb pageName="Book Auditorium" />

            <div className="grid grid-cols-5 gap-8">
              <div className="col-span-7 xl:col-span-3">
                <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      <GetTitle />
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
                        handleSelectChange={handleSelectChange}
                        onSelectFocus={onSelectFocus}
                      />
                      <Step4
                        currentStep={currentStep}
                        params={params}
                        formErrors={formErrors}
                        touched={touched}
                        disabled={disabled}
                        totalPrice={totalPrice}
                        onCheckBoxChange={onCheckBoxChange}
                        setReceipt={setFormState}
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
                <PaymentReview
                  prices={prices}
                  totalAmount={totalAmount}
                  params={params}
                  currentStep={currentStep}
                  handleChange={handleChange}
                  onDiscountClick={onDiscountClick}
                />
              </div>
            </div>
          </div>
          {/* <SuccessModal
            open={open}
            setOpen={setOpen}
            resetParams={resetParams}
            params={params}
            modalContent={modalContent}
          /> */}
          <Modal
            showModal={open}
            setShowModal={setOpen}
            title={modalContent.title}
            type={modalContent.type}
            body={modalContent.message}
            onSubmit={onProceed}
            isLoading={false}
          />
        </>
      )}
    </>
  );
};

export default BookAuditorium;
