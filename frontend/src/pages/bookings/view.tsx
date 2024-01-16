import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
import {
  changeStatus,
  fetch,
  reset,
} from "../../features/bookings/bookingSlice";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modals";
import Datatable from "../../components/datatable";
import useFetch from "../../hooks/useFetch";
import endpoint from "../../utils/endpoints";
import { PulseLoader } from "react-spinners";
import {
  bookingHeaders,
  cssOverride,
  primaryColor,
} from "../../utils/constant";

const ViewBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [filterOpen, setfilterOpen] = useState(false);

  const navigate = useNavigate();

  const toggleFilter = () => {
    setfilterOpen(!filterOpen);
  };

  const handleEditClick = (index: any) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { data, type, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.booking
  );
  const {
    data: data2,
    loading,
    message: message2,
    error,
    success,
    fetchData,
  } = useFetch("/api/bookings");

  // useEffect(() => {
  //   dispatch(fetch());
  // }, []);

  useEffect(() => {
    if (error) {
      toast.error(message2);
    }
    if (success && data2 != null) {
      console.log(data2);
      setBookings(data2.data);
    }
  }, [data2, loading, error, success, message2]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && data != null) {
      console.log(data);
      toast.success(message);
      if (openModal) {
        setOpenModal(false);
      }
      fetchData();
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
    dispatch(changeStatus({ id: Number(bookingId), status: "Cancelled" }));
  };

  const openCancelBookingModal = (id: string) => {
    setBookingId(id);
    setOpenDropdownIndex(null);
    setOpenModal(true);
  };

  if (loading) {
    return (
      <PulseLoader
        color={primaryColor}
        loading={loading}
        cssOverride={cssOverride}
        // size={150}
        // aria-label="Loading Spinner"
        // data-testid="loader"
      />
    );
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="View Bookings" />
        <Datatable
          list={bookings?.slice()?.reverse()}
          properties={bookingHeaders}
          filterOpen={filterOpen}
          checkAll={true}
          handleEditClick={handleEditClick}
          openDropdownIndex={openDropdownIndex!}
          openCancelBookingModal={openCancelBookingModal}
          editBooking={editBooking}
          viewBooking={viewBooking}
          toggleFilter={toggleFilter}
        />
      </div>

      <Modal
        showModal={openModal}
        setShowModal={setOpenModal}
        id={bookingId}
        title={"Cancel Booking"}
        type={"error"}
        body={
          <span>
            Are you sure you want to cancel this booking? Please note that you
            can not reactivate this booking.
          </span>
        }
        onSubmit={cancelBooking}
        isLoading={isLoading}
      />
    </>
  );
};

export default ViewBookings;
