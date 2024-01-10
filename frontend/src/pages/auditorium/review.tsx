import { NumericFormat } from "react-number-format";
import { IBooking } from "../../utils/interfaces";

type Props = {
  params: IBooking;
  prices: Array<any>;
  totalAmount: number;
  currentStep: number;
  handleChange: (event: any) => void;
  onDiscountClick: () => void;
};

const PaymentReview = (props: Props) => {
  const {
    params,
    currentStep,
    prices,
    totalAmount,
    handleChange,
    onDiscountClick,
  } = props;
  const { discount } = params;

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-graylight px-0 py-6 sm:p-6 col-span-5 lg:mt-0 lg:p-6 border-stroke dark:border-strokedark dark:bg-boxdark"
    >
      <div className="dark:border-strokedark">
        <h2
          id="summary-heading"
          className="text-lg font-medium text-black dark:text-white"
        >
          Payment summary
        </h2>
      </div>

      {currentStep == 4 && (
        <div className="px-2 py-6 sm:px-0">
          <form>
            <label
              htmlFor="discount"
              className="block font-medium text-sm text-black dark:text-white"
            >
              Discount code
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                id="discount"
                name="discount"
                value={discount}
                onChange={handleChange}
                className="inputClass2"
              />
              <button
                type="button"
                onClick={onDiscountClick}
                disabled={discount?.length == 0}
                className={`${
                  discount?.length == 0
                    ? "bg-gray-200 text-white disabled"
                    : "bg-red-600 text-white"
                } rounded px-4 text-sm font-medium bie bmz bne bnq bog bok`}
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}

      <dl className="mt-1 m-0">
        {prices.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-t border-gray-200 px-0 py-6 sm:px-0"
          >
            <dt className="flex items-center text-sm text-black dark:text-white">
              <span>{item.label}</span>
            </dt>
            <dd className="text-sm font-medium text-black dark:text-white">
              {item?.value ? (
                item.value
              ) : (
                <NumericFormat
                  value={Number(item.amount).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₦"}
                />
              )}
            </dd>
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-gray-200 px-0 py-6 sm:px-0">
          <dt className="text-base font-medium text-black dark:text-white">
            Total
          </dt>
          <dd className="text-base font-medium text-black dark:text-white">
            <NumericFormat
              value={Number(totalAmount).toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"₦"}
            />
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default PaymentReview;
