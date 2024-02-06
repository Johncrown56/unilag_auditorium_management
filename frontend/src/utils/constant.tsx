import { CSSProperties } from "react";
import { IPaymentDetails } from "./interfaces";
import solutionsIcon1 from "../assets/imgs/png-icons/our-solutions-icon-1.png"
import solutionsIcon2 from "../assets/imgs/png-icons/our-solutions-icon-2.png"
import solutionsIcon3 from "../assets/imgs/png-icons/our-solutions-icon-3.png"
import solutionsIcon4 from "../assets/imgs/png-icons/our-solutions-icon-4.png"

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
        selectedAuditorium?.vat !== undefined
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
        selectedAuditorium?.cautionFee !== undefined
          ? Number(selectedAuditorium?.cautionFee) * differenceInDays
          : 0,
    },
    {
      label: "Cleaning Charges",
      key: "cleaningCharges",
      amount:
        selectedAuditorium?.cleaningCharges !== undefined
          ? Number(selectedAuditorium?.cleaningCharges) * differenceInDays
          : 0,
    },
  ];
  return prices;
};

export const paymentStatus = ["All", "Approved", "Pending", "Cancelled"];

export const bookingHeaders = [
  "Auditorium name",
  "Booking Id",
  "Category",
  "Purpose",
  "Date Submitted",
  "Payment Status",
  "Approval Status",
  "Actions",
];

export const cssOverride: CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export const primaryColor = "#a80a0a";

export const topBarMenu = [
  {
    name: "Home",
    link: "/"
  },
  {
    name: "About Us",
    link: "/about-us"
  },
  {
    name: "FAQ",
    link: "/faq"
  },
  {
    name: "Event Gallery",
    link: "/event-gallery"
  },
  {
    name: "Contact Us",
    link: "/contact-us"
  },
]

export const aboutUsPages = [
  {
    name: "About Us",
    link: "/about"
  },
  {
    name: "Pricing",
    link: "/pricing"
  },
  {
    name: "All Auditoriums",
    link: "/auditoriums"
  },
  {
    name: "Event Gallery",
    link: "/gallery"
  },
  {
    name: "Contact Us",
    link: "/contact-us"
  }
]

export const usefulLinkPages = [
  {
    name: "Terms and Conditions",
    link: "/terms"
  },
  {
    name: "Refund Policy",
    link: "/refund-policy"
  },
  {
    name: "FAQ",
    link: "/faq"
  },
  {
    name: "Support",
    link: "/support"
  },
  {
    name: "How it works",
    link: "/how-it-works"
  }
]

export const features = [
  {
    name: "Payments",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    icon: solutionsIcon1
  },
  {
    name: "Collections",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    icon: solutionsIcon2
  },
  {
    name: "Conversions",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    icon: solutionsIcon3
  },
  {
    name: "Global Account",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    icon: solutionsIcon4
  },
]

export const AuditoriumTerms = [
  "I/We agree that the payment of assessed fees for approved venues not later than 7 (seven) days from the date of booking.",
  "I/We agree that there wil be no smoking eating, drinking or use of naked fire and incense in the auditorium.",
  "I/We agree to abide by all the regulations governing the use of the venues and to be fully responsible for any damages incurred.",
  "All Programs must end by 6pm.",
  "All Items used in the hall must be removed immediately after the event.",
  "The Unit will not be liable for any stolen Items.",
  "The caution fee will not be refunded, if any of the facilities are damaged during the event.",
  "Eating and drinking in the Hall also attract non-refundable caution fee.",
]

export const workingSteps = ["Login with your or email address and password.", 
"Book your desired auditorium", "Make payment via Remita", "Get approval for your booking", "Proceed with your event"]

export const faqdata = [
  {
    question: "Can I come for a tour of your facility?",
    answer: "Yes, you are welcome to schedule a facility tour with us. Reach out to us, and our officers will revert within 24 hours.",
  },
  {
    question: "How can I schedule a tour of the facility?",
    answer: "To book a tour, kindly call us or send an email with your contact information and desired date and we will get back to you to confirm.",
  },
  {
    question: "What is your refund policy? ",
    answer: "If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.",
  },
  {
    question: "Do you offer discount on some auditoriums? ",
    answer: "Yes, we offer discounts for some auditoriums based on some factors.",
  },
  {
    question: "What are your business hours? ",
    answer: "8:00 AM – 5:00 PM weekdays excluding public holidays",
  },
];
