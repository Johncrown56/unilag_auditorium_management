import { IPaymentDetails } from "./interfaces";

export const PaymentSummary = (
  selectedAuditorium: IPaymentDetails,
  differenceInDays: number,
  price: number
) => {
  const prices = [
    {
      label: `${differenceInDays} * Hall Fee`,
      key: "hallFee",
      amount: price,
    },
    {
      label: `VAT (${selectedAuditorium?.vat ? selectedAuditorium?.vat : 0}%)`,
      key: "vat",
      amount:
        selectedAuditorium?.vat != undefined
          ? (Number(selectedAuditorium?.vat) / 100) * price * differenceInDays
          : 0,
    },
    {
      label: "Event Day(s)",
      key: "eventDays",
      value: String(differenceInDays),
    },
    {
      label: "Caution Fee (Refundable)",
      key: "cautionFee",
      amount:
        selectedAuditorium?.cautionFee != undefined
          ? Number(selectedAuditorium?.cautionFee) * differenceInDays
          : 0,
    },
    {
      label: "Cleaning Charges",
      key: "cleaningCharges",
      amount:
        selectedAuditorium?.cleaningCharges != undefined
          ? Number(selectedAuditorium?.cleaningCharges) * differenceInDays
          : 0,
    },
  ];
  return prices;
};
