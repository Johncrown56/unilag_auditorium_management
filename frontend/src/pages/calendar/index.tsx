import React, { useEffect, useState } from "react";
import CalendarComponent from "../../components/calendarComponent";
import { fetch, reset } from "../../features/bookings/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { toast } from "react-toastify";
import moment from "moment";

type Props = {};

const Calendar = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, type, isLoading, isError, isSuccess, message } = useSelector(
    (state: any) => state.booking
  );
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetch());
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && data != null) {
      console.log(data);
      const newData = data.map((d: any, i: number) => {
        const startDateMoment = d.startDate ? moment(d.startDate) : moment();
        const endDateMoment = d.endDate ? moment(d.endDate) : moment();

        // Calculate the difference in days
        const differenceInDays =
          endDateMoment.diff(startDateMoment, "days") + 1;
        return {
          id: d.bookingId,
          start: moment(
            `${moment(d.startDate).format("YYYY-MM-DD")} ${d.startTime}`
          ).format("YYYY-MM-DD HH:mm:ss"), //moment(`${moment(d.startDate).format("YYYY-MM-DD")} ${d.startTime}`).format("YYYY-MM-DDTHH:mm:ss"), // d.startDate, //
          end: moment(
            `${moment(d.endDate).format("YYYY-MM-DD")} ${d.endTime}`
          ).format("YYYY-MM-DD HH:mm:ss"), //moment(`${moment(d.endDate).format("YYYY-MM-DD")} ${d.endTime}`).format("YYYY-MM-DDTHH:mm:ss"), //d.endDate, d.endDate, //
          title: d.purpose,
          allDay: differenceInDays == 1 ? true : false,
        };
      });
      console.log(newData);
      setBookings(newData);
    }
    dispatch(reset());
  }, [data, isError, isSuccess, message, dispatch]);

  return <CalendarComponent weekendsVisible={false} currentEvents={bookings} />;
};

export default Calendar;
