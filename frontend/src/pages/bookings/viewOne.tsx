import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchOne, reset } from "../../features/bookings/bookingSlice";
import { toast } from "react-toastify";
import moment from "moment";

type Props = {};

const ViewBookingOne = (props: Props) => {
  const params = useParams();
  console.log(params);
  const { id } = params;
  const dispatch = useDispatch<AppDispatch>();
  const [bookings, setBookings] = useState<any>({});
  const { data, type, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.booking
  );

  useEffect(() => {
    dispatch(fetchOne(id!));
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && data != null) {
      console.log(data);
      setBookings(data[0]);
    }
    dispatch(reset());
  }, [data, isLoading, isError, isSuccess, message, dispatch]);

  if (isLoading) {
    return <span> Loading</span>;
  }

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="View Booking Details" />

      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9">
        <div className="flex flex-col-reverse gap-5 xl:flex-row xl:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row xl:gap-9">
            <div>
              <p className="mb-1.5 text-lg font-medium text-black dark:text-white">
                Auditorium Information
              </p>
              <h4 className="mb-4 text-2xl font-semibold text-black dark:text-white">
                {bookings.name}
              </h4>
              <a href="#" className="block">
                <span className="font-medium">Auditorium:</span> {bookings.name}
              </a>
              <span className="mt-2 block">
                <span className="font-medium">Purpose:</span> {bookings.purpose}
              </span>
              <span className="mt-2 block">
                <span className="font-medium">category:</span>{" "}
                {bookings?.category?.name}
              </span>
            </div>
            <div>
              <p className="mb-1.5 text-lg font-medium text-black dark:text-white">
                Date Information
              </p>
              <h4 className="mb-4 text-2xl font-semibold text-black dark:text-white">
                &nbsp;
              </h4>
              <a href="#" className="block">
                <span className="font-medium">Start Date:</span>{" "}
                {moment(bookings.startDate).format("DD MMMM, YYYY.")}
              </a>
              <span className="mt-2 block">
                <span className="font-medium">End Date:</span>{" "}
                {moment(bookings.endDate).format("DD MMMM, YYYY.")}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            Booking Id #{id}
          </h3>
        </div>
        <div className="my-10 rounded-sm border border-stroke p-5 dark:border-strokedark">
          <div className="items-center sm:flex">
            <div className="mb-3 mr-6 h-20 w-20 sm:mb-0">
              <img
                src="/assets/product-thumb-07a1accf.png"
                alt="product"
                className="h-full w-full rounded-sm object-cover object-center"
              />
            </div>
            <div className="w-full items-center justify-between md:flex">
              <div className="mb-3 md:mb-0">
                <a
                  href="#"
                  className="inline-block font-medium text-black hover:text-primary-600 dark:text-white"
                >
                  Mist Black Triblend
                </a>
                <p className="flex text-sm font-medium">
                  <span className="mr-5"> Color: White </span>
                  <span className="mr-5"> Size: Medium </span>
                </p>
              </div>
              <div className="flex items-center md:justify-end">
                <p className="mr-20 font-semibold text-black dark:text-white">
                  Qty: 01
                </p>
                <p className="mr-5 font-semibold text-black dark:text-white">
                  $120.00
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 sm:w-1/2 xl:w-3/12">
            <div className="mb-10">
              <h4 className="mb-4 text-xl font-semibold text-black dark:text-white md:text-2xl">
                Shipping Method
              </h4>
              <p>
                FedEx - Take up to 3 <br />
                working days.
              </p>
            </div>
          </div>
          <div className="w-full px-4 sm:w-1/2 xl:w-3/12">
            <div className="mb-10">
              <h4 className="mb-4 text-xl font-semibold text-black dark:text-white md:text-2xl">
                Payment Method
              </h4>
              <p>
                Apply Pay Mastercard <br />
                **** **** **** 5874
              </p>
            </div>
          </div>
          <div className="w-full px-4 xl:w-6/12">
            <div className="mr-10 text-right md:ml-auto">
              <div className="ml-auto sm:w-1/2">
                <p className="mb-4 flex justify-between font-medium text-black dark:text-white">
                  <span> Subtotal </span>
                  <span> $120.00 </span>
                </p>
                <p className="mb-4 flex justify-between font-medium text-black dark:text-white">
                  <span> Shipping Cost (+) </span>
                  <span> $10.00 </span>
                </p>
                <p className="mb-4 mt-2 flex justify-between border-t border-stroke pt-6 font-medium text-black dark:border-strokedark dark:text-white">
                  <span> Total Payable </span>
                  <span> $130.00 </span>
                </p>
              </div>
              <div className="mt-10 flex flex-col justify-end gap-4 sm:flex-row">
                <button className="flex items-center justify-center rounded border border-primary-600 py-2.5 px-8 text-center font-medium text-primary-600 hover:bg-opacity-90">
                  Cancel Booking
                </button>
                <button className="flex items-center justify-center rounded bg-primary-600 py-2.5 px-8 text-center font-medium text-white hover:bg-opacity-90">
                  Approve Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookingOne;
