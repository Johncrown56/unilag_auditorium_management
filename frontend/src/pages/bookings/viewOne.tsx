import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  changeStatus,
  fetchOne,
  reset,
} from "../../features/bookings/bookingSlice";
import { toast } from "react-toastify";
import moment from "moment";
import { PulseLoader } from "react-spinners";
import { bookingDetails, cssOverride, paymentDetails, primaryColor, userDetails } from "../../utils/constant";
import Modal from "../../components/modals";
import Img from "../../components/lazyLoadImage";
import { BiCalendar } from "react-icons/bi";
import { formatCurrency, joinArray, joinNames } from "../../utils/functions";

type Props = {};
type IStatus = "Approved" | "Pending" | "Cancelled";

const ViewBookingOne = (props: Props) => {
  const params = useParams();
  console.log(params);
  const { id } = params;
  const dispatch = useDispatch<AppDispatch>();
  const [mount, setMount] = useState<boolean>(false);
  const [defaultImage, setDefaultImage] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [status, setStatus] = useState<IStatus>("Pending");
  const { data, type, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.booking
  );

  useEffect(() => {
    setMount(true);
    dispatch(fetchOne(id!));
  }, []);

  useEffect(() => {
    if (isError) {
      message !== "" && toast.error(message);
    }
    if (isSuccess && data != null) {
      console.log(data);
      setBooking(data[0]);
      setDefaultImage(data[0]?.images[0]?.fileName);
      console.log(type);
      if (type != "booking/fetchOne/fulfilled") {
        message !== "" && toast.success(message);
        if (openModal) {
          setOpenModal(false);
        }
        dispatch(fetchOne(id!));
      }
    }
    dispatch(reset());
  }, [data, isLoading, isError, isSuccess, message, dispatch]);

  const onSubmit = () => {
    dispatch(changeStatus({ id: Number(booking?.bookingId), status }));
  };

  const openBookingModal = (value: IStatus) => {
    console.log(value);
    setStatus(value);
    setOpenModal(true);
  };

  const selectImage = (image: string) => {
    setDefaultImage(image);
  };

  if (isLoading) {
    return (
      <PulseLoader
        color={primaryColor}
        loading={isLoading}
        cssOverride={cssOverride}
        // size={150}
      />
    );
  }

  const arrays = booking && [
    {
      name: "Booking Details",
      array: bookingDetails,
    },
    {
      name: "Payment Details",
      array: paymentDetails,
    },
    {
      name: "User Details",
      array: userDetails,
    },
  ];

  const buttons = booking && [
    (booking.status === "Pending" || booking.status === "Cancelled") && {
      name: "Approve",
      color: "bg-success-600",
      button: () => openBookingModal("Approved"),
    },
    (booking.status === "Approved" || booking.status === "Cancelled") && {
      name: "Pending",
      color: "bg-red-600",
      button: () => openBookingModal("Pending"),
    },
    (booking.status === "Approved" || booking.status === "Pending") && {
      name: "Cancel",
      color: "bg-yellow-600",
      button: () => openBookingModal("Cancelled"),
    },    
  ].filter(Boolean)

  return (
    <>
      {mount && data != null && booking && (
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="View Booking Details" />

          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-8">
              <div className="col-span-1 md:col-span-3">
                <div className="flex flex-col-reverse">
                  <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                    <div
                      role="tablist"
                      aria-orientation="horizontal"
                      className="grid grid-cols-5 gap-4"
                    >
                      {booking?.images.map((item: any, i: number) => (
                        <button
                          key={i}
                          id="img-click"
                          onClick={() => selectImage(item?.fileName)}
                          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                        >
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Img
                              src={item?.fileName}
                              alt="Asset 14"
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={`${
                              item?.fileName === defaultImage
                                ? "ring-indigo-500 ring-2 ring-offset-2"
                                : ""
                            }  pointer-events-none absolute inset-0 rounded-md`}
                            aria-hidden="true"
                          ></span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex h-auto w-full">
                    <div
                      id="headlessui-tabs-panel-35"
                      role="tabpanel"
                      aria-labelledby="headlessui-tabs-tab-34"
                      className="w-full"
                    >
                      <Img
                        src={defaultImage}
                        alt="default"
                        className="h-full w-full object-cover object-center sm:rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-5">
                <div className="w-full rounded-lg border border-gray-40 p-6 md:p-8">
                  <div className="text-xl font-bold md:text-3xl">
                    {`${booking.name} Hall`}
                  </div>
                  {/* <div className="text-md font-bold text-gray-500 md:text-xl">
                  Egbeda, Lagos
                </div> */}
                  <div className="mt-4 grid grid-cols-2 gap-4 md:mt-8 md:grid-cols-3">
                    <div className="flex items-center">
                      <BiCalendar className="mr-2 h-8 w-8 text-primary md:h-12 md:w-12" />
                      <div>
                        <div className="md:text-md text-sm font-semibold">
                          {moment(booking.startDate).format(
                            "ddd Do MMM, YYYY."
                          )}
                        </div>
                        <div className="mt-1 text-xs font-light text-gray-80 md:text-sm">
                          Start Date
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <BiCalendar className="mr-2 h-8 w-8 text-primary md:h-12 md:w-12" />
                      <div>
                        <div className="md:text-md text-sm font-semibold">
                          {moment(booking.endDate).format("ddd Do MMM, YYYY.")}
                        </div>
                        <div className="mt-1 text-xs font-light text-gray-80 md:text-sm">
                          End Date
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <BiCalendar className="mr-2 h-8 w-8 text-primary md:h-12 md:w-12" />
                      <div>
                        <div className="md:text-md text-sm font-semibold">
                          {moment(booking.startTime, "HH:mm:ss").format(
                            "h:mma"
                          )}
                        </div>
                        <div className="mt-1 text-xs font-light text-gray-80 md:text-sm">
                          Start Time
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col md:flex-row">
                    {buttons.map((item: any, i: number)=> (
                    <button key={i}
                      type="button"
                      onClick={item.button}
                      className={`${item.color} relative inline-flex items-center justify-center rounded-full px-10 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors text-white hover:bg-green-90 focus:ring-green-70 disabled:bg-gray-40 mt-5 border text-sm md:mr-5 md:mt-0`}
                    >
                      {`${item.name} Booking `} 
                    </button>
                    ))}

                    {/* <button
                      type="button"
                      onClick={() => openBookingModal("Cancelled")}
                      className="relative inline-flex items-center justify-center rounded-full px-10 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors bg-red-600 text-white hover:bg-green-90 focus:ring-green-70 disabled:bg-gray-40 mt-5 border text-sm md:mt-0"
                    >
                      {" "}
                      Cancel Booking
                    </button> */}
                  </div>
                </div>

                {arrays.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="w-full rounded-lg border border-gray-40 p-8 my-10"
                  >
                    <div className="text-xl font-bold md:text-2xl">
                      {item.name}
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-4 md:mt-8 md:grid-cols-3">
                      {item.array.map(
                        (
                          it: { name: string; label: string; mode?: string },
                          index: number
                        ) => (
                          <div key={index}>
                            <div className="md:text-md text-sm font-semibold">
                              {it.label}
                            </div>
                            <div className="mt-1 text-xs font-light text-gray-80 md:text-sm">
                              {it.mode === "date" ? (
                                <span>
                                  {it.name.includes(".")
                                    ? moment(
                                        booking[it.name.split(".")[0]][
                                          it.name.split(".")[1]
                                        ]
                                      ).format("ddd Do MMM, YYYY.")
                                    : moment(booking[it.name]).format(
                                        "ddd Do MMM, YYYY."
                                      )}
                                </span>
                              ) : it.mode === "time" ? (
                                <span>
                                  {it.name.includes(".")
                                    ? moment(
                                        booking[it.name.split(".")[0]][
                                          it.name.split(".")[1]
                                        ]
                                      ).format("h:mma")
                                    : moment(booking[it.name]).format("h:mma")}
                                </span>
                              ) : it.mode === "currency" ? (
                                <span>
                                  {it.name.includes(".")
                                    ? formatCurrency(Number(
                                        booking[it.name.split(".")[0]][
                                          it.name.split(".")[1]
                                        ]
                                      ))
                                    : formatCurrency(Number(booking[it.name]))}
                                </span>
                              ) : it.mode === "boolean" ? (
                                <span>
                                  {it.name.includes(".")
                                    ? Boolean(
                                        booking[it.name.split(".")[0]][
                                          it.name.split(".")[1]
                                        ]
                                      ) == true
                                      ? "True"
                                      : "False"
                                    : Boolean(booking[it.name]) == true
                                    ? "True"
                                    : "False"}
                                </span>
                              ) : it.mode === "array" ? (
                                <span>
                                  {it.name.includes(".")
                                    ? joinNames(
                                        booking[it.name.split(".")[0]][
                                          it.name.split(".")[1]
                                        ]
                                      )
                                    : joinNames(booking[it.name])}
                                </span>
                              ) : (
                                <span>
                                  {it.name.includes(".")
                                    ? booking[it.name.split(".")[0]][
                                        it.name.split(".")[1]
                                      ]
                                    : booking[it.name]}
                                </span>
                              )}
                              {/* ) } */}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        showModal={openModal}
        setShowModal={setOpenModal}
        title={`${
          status === "Approved"
            ? "Approve"
            : status === "Cancelled"
            ? "Cancel"
            : "Pend"
        } Booking`}
        type={`${status === "Approved" ? "success" : "error"}`}
        body={
          <p>
            Are you sure you want to{" "}
            {status === "Approved"
              ? "approve"
              : status === "Cancelled"
              ? "cancel"
              : "pend"}{" "}
            this booking?
          </p>
        }
        onSubmit={onSubmit}
        isLoading={isLoading}
        mode={"alert"}
      />
    </>
  );
};

export default ViewBookingOne;
