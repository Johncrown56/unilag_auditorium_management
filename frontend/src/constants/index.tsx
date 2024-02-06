import { BiDollarCircle, BiMessageSquareDetail } from "react-icons/bi";
import { BsCalendar, BsCreditCard, BsGear, BsPerson } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { PiWarehouseBold } from "react-icons/pi";
import { HiCalendar, HiOutlineBookOpen } from "react-icons/hi2";
import moment from "moment";
import { IMenu } from "../utils/interfaces";

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
