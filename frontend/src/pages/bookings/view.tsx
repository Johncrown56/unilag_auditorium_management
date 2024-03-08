import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
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
  bookingColumns,
  cssOverride,
  primaryColor,
} from "../../utils/constant";

const ViewBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");

  const navigate = useNavigate();
 
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { data, type, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.booking
  );
  const {
    data: data2,
    loading,
    message: message2,
    success,
    fetchData,
  } = useFetch(endpoint.BOOKING);

  // useEffect(() => {
  //   dispatch(fetch());
  // }, []);

  useEffect(() => {
    if (!success) {
      message2 !== "" && toast.error(message2);
    }
    if (success && data2 != null) {
      console.log(data2);
      setBookings(data2.data);
    }
  }, [data2, loading, success, message2]);

  useEffect(() => {
    if (isError) {
      message !== "" &&toast.error(message);
    }
    if (isSuccess && data != null) {
      console.log(data);
      message !== "" && toast.success(message);
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

  const createBooking = () => {
    navigate(`/bookings/create`);
  };

  const editBooking = (item: any) => {
    console.log(item)
    const {bookingId: bId} = item;
    navigate(`/bookings/edit/${bId}`);
  };

  const viewBooking = (item: any) => {
    const {bookingId: bId} = item;
    navigate(`/bookings/view/${bId}`);
  };

  const cancelBooking = () => {
    dispatch(changeStatus({ id: Number(bookingId), status: "Cancelled" }));
  };

  const openCancelBookingModal = (item: any) => {
    const {bookingId: bId} = item;
    setBookingId(bId);
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
          list={bookings}
          columns={bookingColumns}
          idColumnName={"bookingId"}
          title={"Booking"}
          showFilter={true}
          createButton={createBooking}
          editButton={editBooking}
          viewButton={viewBooking}
          cancelButton={openCancelBookingModal}          
        />
      </div>

      <Modal
        showModal={openModal}
        setShowModal={setOpenModal}
        id={bookingId}
        title={"Cancel Booking"}
        type={"error"}
        body={
          <p>
            Are you sure you want to cancel this booking? Please note that you
            can not reactivate this booking.
          </p>
        }
        onSubmit={cancelBooking}
        isLoading={isLoading}
        mode={"alert"}
      />
    </>
  );
};

export default ViewBookings;
