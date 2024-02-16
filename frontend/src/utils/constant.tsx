import { CSSProperties } from "react";
import { IPaymentDetails } from "./interfaces";
import solutionsIcon1 from "../assets/imgs/png-icons/our-solutions-icon-1.png"
import solutionsIcon2 from "../assets/imgs/png-icons/our-solutions-icon-2.png"
import solutionsIcon3 from "../assets/imgs/png-icons/our-solutions-icon-3.png"
import solutionsIcon4 from "../assets/imgs/png-icons/our-solutions-icon-4.png"
import { BiDollarCircle, BiMessageSquareDetail } from "react-icons/bi";
import { BsCalendar, BsCreditCard, BsGear, BsPerson } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { PiWarehouseBold } from "react-icons/pi";
import { HiCalendar, HiOutlineBookOpen } from "react-icons/hi2";
import moment from "moment";
import { IMenu } from "../utils/interfaces";


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

export const notifications = [
  {
    title: "Edit your information in a swipe",
    text: "Sint occaecat cupidatat non proident, sunt in culpa qui official deserunt mollit anim.",
    link: "/",
    date: moment().format("DD MMM, YYYY."),
  },
  {
    title: "It is a long established fact",
    text: "that a reader will be distracted by the readable.",
    link: "/",
    date: moment().format("DD MMM, YYYY."),
  },
  {
    title: "There are many variations",
    text: "of passages of Lorem Ipsum available, but the majority have suffered",
    link: "/",
    date: moment().format("DD MMM, YYYY."),
  },
  {
    title: "There are many variations",
    text: "of passages of Lorem Ipsum available, but the majority have suffered",
    link: "/",
    date: moment().format("DD MMM, YYYY."),
  },
];

export const menus: IMenu[] = [
  {
    name: "",
    section: [
      {
        name: "Dashboard",
        link: "/dashboard",
        icon: <RxDashboard />,
        count: 0,
        submenus: [],
      },
      {
        name: "Transaction History",
        link: "/transaction-history",
        icon: <BsCreditCard />,
      },
    ],
  },
  {
    name: "",
    section: [
      {
        name: "Auditorium Booking",
        link: "/bookings/create",
        icon: <PiWarehouseBold />,
        count: 0,
        submenus: [
          {
            name: "Book Auditorium",
            link: "/bookings/create",
          },
          {
            name: "View Bookings",
            link: "/bookings/view",
          },
        ],
      },
    ],
  },
  {
    name: "Support",
    section: [
      {
        name: "Profile",
        link: "/profile",
        icon: <BsPerson />,
        submenus: [],
      },
      {
        name: "Settings",
        link: "/settings",
        icon: <BsGear />,
      },
      {
        name: "Notifications",
        link: "/notifications",
        count: 3,
        icon: <BiMessageSquareDetail />,
      },
      {
        name: "Referrals",
        link: "/referrals",
        icon: <BiDollarCircle />,
        badge: "Coming Soon",
      },
    ],
  },
  {
    name: "Admin",
    section: [
      {
        name: "Auditorium",
        link: "/auditorium/create",
        icon: <PiWarehouseBold />,
        count: 0,
        submenus: [
          {
            name: "Create Auditorium",
            link: "/auditorium/create",
          },
          {
            name: "View Auditorium",
            link: "/auditorium/view",
          },
        ],
      },
      {
        name: "Bookings",
        link: "/bookings/view",
        icon: <HiOutlineBookOpen />,
        submenus: [],
      },
      {
        name: "Calendar",
        link: "/calendar",
        icon: <HiCalendar />,
        submenus: [],
      },
      {
        name: "Features",
        link: "/features",
        icon: <HiCalendar />,
        submenus: [],
      },
      {
        name: "Event Categories",
        link: "/categories",
        icon: <HiCalendar />,
        submenus: [],
      }
    ],
  },
];

export const userCategories = [
  "Student",
  "Staff",
  "Individual",
  "Organization",
];

export const paymentOptions = [
  {
    value: "Remita",
    label: "Remita",
    color: "bg-red-400",
  },
  {
    value: "Cash Transfer",
    label: "Cash Transfer",
    color: "bg-blue-400",
  },
];

export const paymentStatus = ["All", "Approved", "Pending", "Cancelled"];

export const bookingColumns = [
  { name: 'name', label: 'Auditorium name' },
  { name: 'bookingId', label: 'Booking Id'},
  { name: 'category.name', label: 'Category' },
  { name: 'purpose', label: 'Purpose' },
  { name: 'dateCreated', label: 'Date Submitted', mode: "date"  },
  { name: 'startDate', label: 'Event Date', mode: "date" },
  { name: 'paymentStatus', label: 'Payment Status', mode: "boolean" },
  { name: 'status', label: 'Approval Status', mode: "badge"}, 
  { name: 'actions', label: 'Actions' }
];

export const featureColumns = [
  { name: 'name', label: 'Features name' },
  { name: 'id', label: 'Feature Id'},
  { name: 'dateCreated', label: 'Date Created', mode: "date" }, 
  { name: 'dateUpdated', label: 'Date Updated', mode: "date" }, 
  { name: 'actions', label: 'Actions' }
];

export const categoryColumns =  [
  { name: 'name', label: 'Category name' },
  { name: 'id', label: 'Category Id'},
  { name: 'dateCreated', label: 'Date Created', mode: "date" }, 
  { name: 'dateUpdated', label: 'Date Updated', mode: "date" }, 
  { name: 'actions', label: 'Actions' }
]

export const cssOverride: CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export const primaryColor = "#a80a0a";

export const numbersPerPage = [10, 20, 50];

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
