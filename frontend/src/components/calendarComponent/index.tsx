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

const CalendarComponent = (props: Props) => {
  const { weekendsVisible, currentEvents } = props;
  console.log(currentEvents);

  const renderEventContent = (eventInfo: EventContentArg) => {
    console.log(eventInfo);
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
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
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        // timeZone="Africa/Lagos"
        initialView="dayGridMonth"
        weekends={weekendsVisible}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List",
        }}
        // eventContent={renderEventContent}
        events={currentEvents}
        eventClick={(arg: EventClickArg) => {
          console.log(arg);
        }}
      />
    </div>
  );
};

export default CalendarComponent;
