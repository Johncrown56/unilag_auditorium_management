import React, { useEffect, useState } from "react";
import CalendarComponent from "../../components/calendarComponent";
import { fetch, reset } from "../../features/bookings/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { toast } from "react-toastify";
import moment from "moment";
import { stringToColor } from "../../utils/functions";
import { CalendarColors } from "../../utils/constant";

type Props = {};

const Calendar = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, type, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.booking
  );
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetch());
  }, []);

  const convertDate = (startDate: Date, startTime: string) => {
    const newStartDate = moment(startDate).format("YYYY-MM-DD");
    const finalDate = `${newStartDate} ${startTime}`;
    return finalDate;
  }

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && data != null) {
      //console.log(data);
      const newData = data.map((d: any, i: number) => {
        const startDateMoment = d.startDate ? moment(d.startDate) : moment();
        const endDateMoment = d.endDate ? moment(d.endDate) : moment();
        // Calculate the difference in days
        const differenceInDays = endDateMoment.diff(startDateMoment, "days") + 1;
        // Generate a map of unique names to colors dynamically
        const nameColorMap: Record<string, string> = {};
        data.forEach((event: any, index: number) => {

          if (!nameColorMap[event.name]) {
            // Assign a color to the name if it hasn't been assigned one already
            nameColorMap[event.name] = CalendarColors[index % CalendarColors.length]; //`color${index + 1}`; // color coding logic can be used here also
          }
        });
        const color = nameColorMap[d.name];
        return {
          id: d.bookingId,
          start: convertDate(d.startDate, d.startTime),
          end: convertDate(d.endDate, d.endTime),
          title: d.purpose,
          //allDay: false, //differenceInDays == 1 ? true : false,
          backgroundColor: stringToColor(d.name), //color,
          borderColor: stringToColor(d.name), //color,
          extendedProps: {
            name: d.name,
            bookingId: d.bookingId,
            title: d.purpose,
            status: d.status,
            remarks: d.remarks,
            paymentStatus: d.paymentStatus,
            startDate: d.startDate,
            endDate: d.endDate,
            startTime: d.startTime,
            endTime: d.endTime
          }
        };
      });
      setBookings(newData);
    }
    dispatch(reset());
  }, [data, isError, isSuccess, message, dispatch]);

  return <CalendarComponent weekendsVisible={true} currentEvents={bookings} />;
};

export default Calendar;
