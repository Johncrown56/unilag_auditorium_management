import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
  EventInput,
} from "@fullcalendar/core";
import Modal from "../modals";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsClock } from "react-icons/bs";
import moment from "moment";
import { HiClock } from "react-icons/hi2";
import { BiCalendarEvent } from "react-icons/bi";
//import momentTimezonePlugin from "@fullcalendar/moment-timezone";

type Props = {
  weekendsVisible: boolean;
  currentEvents: MyEvent[];
};

interface MyEvent extends EventInput {
  id: string;
  title: string;
  start: string; // ISO 8601 date string
}

type extendProps = {
  name: string,
  bookingId: string,
  title: string,
  status: string,
  remarks: string,
  paymentStatus: number,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string
}

const CalendarComponent = (props: Props) => {
  const extendProps = {
    name: "",
    bookingId: "",
    title: "",
    status: "",
    remarks: "",
    paymentStatus: 0,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: ""
  }
  const { weekendsVisible, currentEvents } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [booking, setBooking] = useState<extendProps>(extendProps)
  //console.log(currentEvents);
  const navigate = useNavigate();

  const onProceed = () => {
    navigate(`/bookings/view/${booking.bookingId}`);
  }

  const editCategory = (item: any) => {
    setBooking(item)
  };

  const onEventClick = (arg: EventClickArg) => {
    const { extendedProps } = arg.event._def;
    setBooking(extendedProps as extendProps)
    setOpen(true);
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    // console.log(eventInfo);
    const { title, backgroundColor, extendedProps} = eventInfo.event
    return (
      <>
        {/* <b>{eventInfo.event.id}</b> */}
        <div style={{ backgroundColor: backgroundColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} 
        className=" cursor-pointer rounded-lg p-1.5 text-white dark:text-white">
          <p><b>{title}</b></p>
          <p><span>{moment(extendedProps.startTime, "HH:mm:ss").format("h:mma")} - {moment(extendedProps.endTime, "HH:mm:ss").format("h:mma")}</span></p>
        </div>
      </>
    );
  };

  const renderSidebarEvent = (event: EventApi) => {
    return (
      <li key={event.id}>
        <b>
          {formatDate(event.start!, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </b>
        <i>{event.title}</i>
      </li>
    );
  };

  const Details = () => {
    return (
      <div id="details" className="text-left">
        <span className="text-black dark:text-white font-semibold block mb-2">Purpose</span>
        <span className="block mb-3 text-black dark:text-white">{booking.title}.</span>
        <span className="text-black dark:text-white font-semibold block mb-2">Remarks</span>
        <span className="block mb-3 text-black dark:text-white">{booking.remarks}.</span>
        <div className="grid grid-cols-2 sm:grid-cols-2 text-black dark:text-white">
          <div className="mb-2">
            <div className=" text-base font-semibold">Start Date</div>
            <p className="flex items-center m-0">
              <BiCalendarEvent className="text-700 mr-2" />
              <span>{moment(booking.startDate).format("ddd Do MMM, YYYY.")}</span>
            </p>
          </div>
          <div className="mb-2">
            <div className=" text-base font-semibold">End Date</div>
            <p className="flex items-center m-0">
              <BiCalendarEvent className="text-700 mr-2" />
              <span>{moment(booking.endDate).format("ddd Do MMM, YYYY.")}</span>
            </p>
          </div>
          <div className="mb-2">
            <div className=" text-base font-semibold">Start Time</div>
            <p className="flex items-center m-0">
              <BsClock className="text-700 mr-2" />
              <span>{moment(booking.startTime, "HH:mm:ss").format("h:mma")}</span>
            </p>
          </div>
          <div className="mb-2">
            <div className=" text-base font-semibold">End Time</div>
            <p className="flex items-center m-0">
              <BsClock className="text-700 mr-2" />
              <span>{moment(booking.endTime, "HH:mm:ss").format("h:mma")}</span>
            </p>
          </div>
          <div className="mb-2">
            <div className=" text-base font-semibold">Status</div>
            <div className="flex items-center m-0">
              <div className={`${booking.status === "Approved"
                ? "bg-green-600"
                : booking.status === "Pending"
                  ? "bg-red-600"
                  : "bg-yellow-600"
                } border rounded-full w-3 h-3 mr-2 `}
            ></div>
            {booking.status}
            </div>
          </div>
          <div className="mb-2">
            <div className=" text-base font-semibold text-black dark:text-white">Payment Status</div>
            <div className="flex items-center m-0 text-black dark:text-white">
              <p className={`${Boolean(booking.paymentStatus)
                ? "bg-green-300 text-success-500"
                : " bg-red-300 text-red-600"
                }  inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium`}
              >
                {booking.paymentStatus ? "Paid" : "Unpaid"}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          // timeZone="Africa/Lagos"
          initialView="dayGridMonth"
          weekends={weekendsVisible}
          selectable={true}
          selectMirror={true}
          //forceEventDuration={true}
          //dayMaxEvents={true}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth,listWeek",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            listMonth: "List Month",
            listWeek: "List Week",
          }}
          eventContent={renderEventContent}
          events={currentEvents}
          eventClick={onEventClick}
        />
      </div>
      <Modal
        showModal={open}
        setShowModal={setOpen}
        title={`${booking.name} Hall`}
        body={<Details />}
        onSubmit={onProceed}
        isLoading={false}
        mode={"alert"}
        submitText={"View Booking"}
      />
    </>
  );
};

export default CalendarComponent;
