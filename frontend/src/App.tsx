import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, RouteProps } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/protectedRoute";
import PageNotFound from "./pages/not-found";
import PublicRoute from "./components/publicRoute";
import ContactUs from "./pages/contact-us";
import CreateAuditorium from "./pages/auditorium/create";
import ViewAuditorium from "./pages/auditorium/view";
import FrontAuditorium from "./pages/front/auditoriums";
import BookAuditorium from "./pages/bookings/book";
import ViewBookings from "./pages/bookings/view";
import Settings from "./pages/settings";
import Profile from "./pages/profile";
import Notications from "./pages/notifications";
import Referrals from "./pages/referrals";
import TransactionHistory from "./pages/transactions";
import ViewBookingOne from "./pages/bookings/viewOne";
import Calendar from "./pages/calendar";
import EditBooking from "./pages/bookings/edit";

interface PublicRouteProps {
  path: string;
  index?: boolean;
  element: JSX.Element;
}

const PublicRoutes: React.FC<PublicRouteProps> = ({ element: Component }) => (
  <>
    {/* <Header /> */}
    <Route element={Component} />
    {/* <Footer /> */}
  </>
);

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route index path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route
              path="/auditorium/details/:id"
              element={<FrontAuditorium />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auditorium/create" element={<CreateAuditorium />} />
            <Route path="/auditorium/view" element={<ViewAuditorium />} />
            <Route path="/bookings/view" element={<ViewBookings />} />
            <Route path="bookings/create" element={<BookAuditorium />} />
            <Route path="/bookings/view/:id" element={<ViewBookingOne />} />
            <Route path="/bookings/edit/:id" element={<EditBooking />} />
            <Route
              path="/transaction-history"
              element={<TransactionHistory />}
            />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notications />} />
            <Route path="/referrals" element={<Referrals />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

{
  /* <Route path="/:event/:id" element={<Details />} />
      <Route path="/search/:query" element={<SearchResult />} />
      <Route path="/explore/:mediaType" element={<Explore />} />
      */
}
