import React, { useEffect, useState } from "react";
import CardOne from "../../components/DashboardCards/CardOne";
import CardTwo from "../../components/DashboardCards/CardTwo";
import CardThree from "../../components/DashboardCards/CardThree";
import CardFour from "../../components/DashboardCards/CardFour";
import ChartOne from "../../components/charts/ChartOne";
import ChartTwo from "../../components/charts/ChartTwo";
import ChartThree from "../../components/charts/ChartThree";
import TableOne from "../../components/Tables/TableOne";
import MapOne from "../../components/Maps/MapOne";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  fetch as fetchAuditorium,
  reset as resetAuditorium,
} from "../../features/auditoriums/auditoriumSlice";
import {
  fetch as fetchBooking,
  reset as resetBooking,
} from "../../features/bookings/bookingSlice";
import { fetchAll, reset as resetUsers } from "../../features/users/userSlice";
import { toast } from "react-toastify";
import TableThree from "../../components/Tables/TableThree";
import useFetch from "../../hooks/useFetch";
import { Greeting } from "../../utils/functions";

type Props = {};

const Dashboard = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { firstName, role } = user;
  const {
    data: data1,
    type,
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state: RootState) => state.booking);
  // const { data: data2 } = useSelector((state: any) => state.auditorium);

  // const { data: data3 } = useSelector((state: any) => state.users);
  // const [allData, setAllData] = useState({
  //   revenue: [],
  //   bookings: [],
  //   auditoriums: [],
  //   users: [],
  // });


  // useEffect(() => {
  //   if (isError) {
  //     toast.error(message);
  //   }
  //   if (isSuccess && data1 != null) {
  //     console.log(data1);
  //     console.log(data2);
  //     console.log(data3);
  //     setAllData((prevState) => ({
  //       ...prevState,
  //       bookings: data1,
  //     }));
  //   }
  //   if (data2 != null) {
  //     console.log(data2);
  //     setAllData((prevState) => ({
  //       ...prevState,
  //       auditoriums: data2,
  //     }));
  //   }
  //   if (data3 != null) {
  //     console.log(data3);    
  //     setAllData((prevState) => ({
  //       ...prevState,
  //       users: data3,
  //     }));
  //   }
  //   if (data4 != null) {
  //     console.log(data4);
  //     setAllData((prevState) => ({
  //       ...prevState,
  //       revenue: data4.data,
  //     }));
  //   }
  //   console.log(allData)
  //   dispatch(resetBooking());
  //   dispatch(resetAuditorium());
  //   dispatch(resetUsers());
  // }, [data1, isError, isSuccess, message, dispatch]);

  // useEffect(() => {
  //   if (role === "admin") { 
  //     dispatch(fetchAuditorium());
  //     dispatch(fetchBooking());
  //     dispatch(fetchAll());
  //   } else {
  //     dispatch(fetchBooking());
  //   }
  // }, []);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {`${Greeting()} ${firstName}`}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne title={"Total Revenue"} />
        <CardTwo title={"Total Bookings"} />
        <CardThree title={"Total Auditoria"} />
        <CardFour title={"Total Users"} />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <TableThree />
        <div className="col-span-12 xl:col-span-8">{/* <TableOne /> */}</div>
      </div>
    </>
  );
};

export default Dashboard;
