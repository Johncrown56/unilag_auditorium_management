import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
import {
  fetch,
  fetchByUser,
  reset,
} from "../../features/bookings/bookingSlice";
import moment from "moment";
import { BiEdit } from "react-icons/bi";
import { HiChevronDown, HiPlus, HiTrash } from "react-icons/hi2";
import { HiEye } from "react-icons/hi";
import { FaAngleDown, FaFilter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/modals/modal";

type Props = {};

const ViewBookings = (props: Props) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [filterOpen, setfilterOpen] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { firstName, role } = user;

  const navigate = useNavigate();

  const toggleFilter = () => {
    setfilterOpen(!filterOpen);
  };

  const handleEditClick = (index: any) => {
    console.log(index);
    console.log(openDropdownIndex);
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { data, type, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.booking
  );

  useEffect(() => {
    if (role === "admin") {
      dispatch(fetch());
    } else {
      dispatch(fetchByUser());
    }
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && data != null) {
      console.log(data);
      setBookings(data);
    }
    dispatch(reset());
  }, [data, isLoading, isError, isSuccess, message, dispatch]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const editBooking = (id: string) => {
    navigate(`/bookings/edit/${id}`);
  };

  const viewBooking = (id: string) => {
    navigate(`/bookings/view/${id}`);
  };

  const cancelBooking = () => {
    console.log(bookingId);
    //setOpenModal(false);
  };

  const openCancelBookingModal = (id: string) => {
    setBookingId(id);
    setOpenDropdownIndex(null);
    setOpenModal(true);
  };

  if (isLoading) {
    return <span> Loading...</span>;
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="View Bookings" />

        <div className="">
          <section className="p-1 sm:p-3">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-3">
              <div className="bg-white dark:bg-gray-800 border-t relative shadow-lg sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                  <div>
                    <h3 className="font-medium">All Bookings</h3>
                  </div>
                  <div className="w-full md:w-1/2">
                    <form className="flex items-center">
                      <label htmlFor="simple-search" className="sr-only">
                        Search
                      </label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="simple-search"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Search"
                          required
                        />
                      </div>
                    </form>
                  </div>
                  <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <Link
                      to={"/bookings/create"}
                      className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                    >
                      <HiPlus className="h-5 w-5 mr-2" />
                      Create Booking
                    </Link>
                    <div className="relative mb-50 inline-block">
                      <button
                        onClick={toggleFilter}
                        className="inline-flex items-center gap-2.5 rounded-md bg-white py-2 px-4 font-medium text-dark hover:bg-opacity-95 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Filter Status
                        <FaAngleDown
                          className={`ml-2 w-5 h-5 transform ${
                            filterOpen ? "rotate-180" : "rotate-0"
                          } transition-transform`}
                        />
                      </button>
                      <div
                        className={`${
                          filterOpen ? "block" : "hidden"
                        } absolute left-0 top-full z-40 mt-2 w-full rounded-md border border-stroke bg-white py-3 shadow-card dark:border-strokedark dark:bg-boxdark`}
                      >
                        <ul className="flex flex-col">
                          <li>
                            <button className="flex py-2 px-5 font-medium hover:bg-whiter hover:text-primary-500 dark:hover:bg-meta-4">
                              Approved
                            </button>
                          </li>
                          <li>
                            <button className="flex py-2 px-5 font-medium hover:bg-whiter hover:text-primary-500 dark:hover:bg-meta-4">
                              Pending
                            </button>
                          </li>
                          <li>
                            <button className="flex py-2 px-5 font-medium hover:bg-whiter hover:text-primary-500 dark:hover:bg-meta-4">
                              Cancelled
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          Auditorium name
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Booking Id
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Category
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Purpose
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Date Submitted
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Payment Status
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Approval Status
                        </th>
                        <th scope="col" className="px-4 py-3">
                          <span className="">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={i} className="border-b dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {b.name}
                          </th>
                          <td className="px-4 py-3">{b.bookingId}</td>
                          <td className="px-4 py-3">{b.category.name}</td>
                          <td className="px-4 py-3">{b.purpose}</td>
                          <td className="px-4 py-3">
                            {moment(b.dateCreated).format(
                              "DD MMM, YYYY. HH:MM:ss"
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p
                              className={`${
                                b.paymentStatus == 1
                                  ? "bg-success-600 text-success-500"
                                  : "bg-danger-600 text-danger-600"
                              } inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium`}
                            >
                              {b.paymentStatus == 1 ? "Paid" : "Unpaid"}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            {b.approved == 1 ? "True" : "False"}
                          </td>
                          <td className="px-4 py-3 items-center justify-end">
                            <button
                              onClick={() => handleEditClick(b.bookingId)}
                              className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                              type="button"
                            >
                              <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>

                            <div
                              id={"id-" + i}
                              className={`${
                                openDropdownIndex === b.bookingId
                                  ? "block"
                                  : "hidden"
                              } absolute z-10 w-44 m-0 right-0 bg-white transform opacity-100 scale-100 origin-top-right rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
                            >
                              <ul
                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby={"id-" + i}
                              >
                                <li>
                                  <button
                                    className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    id={`view-booking-${i}`}
                                    onClick={() => viewBooking(b.bookingId)}
                                  >
                                    <HiEye
                                      className="mr-2 h-5 w-5"
                                      color="#a80a0a"
                                    />
                                    View Booking
                                  </button>
                                </li>
                                <li>
                                  <button
                                    id={`edit-booking-${i}`}
                                    onClick={() => editBooking(b.bookingId)}
                                    className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  >
                                    <BiEdit
                                      className="mr-2 h-5 w-5"
                                      color="#a80a0a"
                                    />
                                    Edit Booking
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="text-gray-900 group flex w-full items-center px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    id={`cancel-booking-${i}`}
                                    onClick={() =>
                                      openCancelBookingModal(b.bookingId)
                                    }
                                  >
                                    <HiTrash
                                      className="mr-2 h-5 w-5"
                                      color="#a80a0a"
                                    />
                                    Cancel Booking
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <nav
                  className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                  aria-label="Table navigation"
                >
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      1-10{" "}
                    </span>
                    of
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {` `} {bookings.length}
                    </span>
                  </span>
                  <ul className="inline-flex items-stretch -space-x-px">
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        aria-current="page"
                        className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      >
                        1
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        2
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        ...
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        5
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* <CancelBookingModal open={openModal} setOpen={setOpenModal} /> */}
      {/* <div className="App h-screen flex flex-col items-center justify-center bg-purple-200"> */}
      <Modal
        showModal={openModal}
        setShowModal={setOpenModal}
        id={bookingId}
        title={"Cancel Booking"}
        text={
          "Are you sure you want to cancel this booking? Please note that you can not reactivate this booking."
        }
        proceedButton={cancelBooking}
      />
      {/* </div> */}
    </>
  );
};

export default ViewBookings;
