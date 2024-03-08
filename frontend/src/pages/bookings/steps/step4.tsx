import { useSelector } from "react-redux";
import {
  AuditoriumResponse,
  IBooking,
  IBookingBoolean,
  IStepFormState,
} from "../../../utils/interfaces";
import Dropzone from "../../../components/dropzone";
import { NumericFormat } from "react-number-format";
import { ChangeEvent } from "react";
import { RootState } from "../../../store/store";
import { paymentLink } from "../../../utils/constant";

interface Props extends IStepFormState {
  params: IBooking;
  touched: IBookingBoolean;
  totalPrice: number;
  onCheckBoxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setReceipt: (value: any) => any;
}

const Step4 = (props: Props) => {
  const {
    currentStep,
    params,
    formErrors,
    touched,
    disabled,
    onCheckBoxChange,
    totalPrice,
    setReceipt,
  } = props;
  const { user } = useSelector((state: RootState) => state.auth);
  const { userCategory } = user;
  const { paymentStatus, paymentMethod } = params;

  const transferDetails = [
    {
      name: "Bank",
      value: process.env.REACT_APP_BANK_NAME
    },
    {
      name: "Account No",
      value: process.env.REACT_APP_ACCOUNT_NO
    },
    {
      name: "Account Name:",
      value: process.env.REACT_APP_BANK_ACCOUNT
    }
  ]

  if (currentStep !== 4) {
    return null;
  }

  const makePayment = () => {
    const userPaymentLink = paymentLink.find(
      (item) => item.category === userCategory
    );
    if (userPaymentLink) {
      // Open a new tab with the payment link
      window.open(userPaymentLink.link, "_blank");
    } else {
      // Handle the case where the user's category is not found
      //console.error('Payment link not found for the user category:', userCategory);
      window.open(paymentLink[3].link, "_blank");
    }
  };

  return (
    <div>
      {paymentMethod?.value === "Remita" ? (
        <>
          <div className="pb-4 px-7">
            <h3 className="font-medium text-center text-black dark:text-white">
              Make Payment via UNILAG Payment Portal by clicking the "Pay"
              button below.
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3 py-7">
            <button
              className={`protectedSubmitButton`}
              type="button"
              onClick={makePayment}
            >
              Pay &nbsp; {"  "}
              <NumericFormat
                value={Number(totalPrice).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₦"}
              />
            </button>
          </div>
        </>
      ) : (
        <div  className="">
          <div className="pb-4 px-7">
            <h3 className="font-medium text-center text-black dark:text-white">
              Make Payment to UNILAG Auditorium account details below;
            </h3>
          </div>
          {/* <div className="pb-4 px-0">
            <p>
              <span className="font-bold">Bank: </span>
              {process.env.REACT_APP_BANK_NAME}
            </p>
            <p>
              <span className="font-bold">Account No: </span>{" "}
              {process.env.REACT_APP_ACCOUNT_NO}{" "}
            </p>
            <p>
              <span className="font-bold">Account Name: </span>{" "}
              {process.env.REACT_APP_BANK_ACCOUNT}
            </p>
          </div> */}

            <div className="flex">
              {transferDetails.map((item, i)=> (
              <div className="flex flex-row flex-wrap mr-3 ">
                <span className="leading-6 mr-3 font-medium text-black dark:text-white">{item.name}: </span>
                <span className="leading-6 mr-3 opacity-50 font-medium text-black dark:text-white">{item.value}</span>
              </div>
              ))}
            </div>

        </div>
      )}

      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <div className="w-full">
          <label className="relative inline-flex items-center mb-5 cursor-pointer">
            <input
              type="checkbox"
              name="paymentStatus"
              value=""
              className="sr-only peer"
              checked={paymentStatus}
              onChange={onCheckBoxChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{`I have made payment via ${paymentMethod?.value}`}</span>
          </label>
        </div>
      </div>

      {paymentStatus && (
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full">
            <div className="relative">
              <label className="inputLabelClass" htmlFor="receipt">
                Upload Payment Receipt{" "}
                <small>(The payment receipt generated on remita)</small>
              </label>
              <Dropzone
                id={"receipt"}
                setReceipt={setReceipt}
                maxFiles={1}
                multiple={false}
                touched={touched}
                maximumSize={1 * 1024 * 1024} // 1MB
                className="dropzoneClass"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4;
