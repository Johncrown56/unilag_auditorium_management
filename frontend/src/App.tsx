import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  RouteProps,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import FrontAuditorium from "./pages/front/auditoriums/view-one";
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
import { IdleTimerProvider } from "react-idle-timer";
import { logout } from "./features/auth/authslice";
import { logoutFromHelper, logoutOnIdle } from "./utils/helpers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { useNavigateAndClearToken } from "./utils/http";
import { removeItem } from "./utils/storage";
import AuthConstants from "./config/authconstant";
import FrontAuditoriumViewOne from "./pages/front/auditoriums/view-one";
import FrontAuditoriumView from "./pages/front/auditoriums/view";
import Faq from "./pages/faq";
import EventGallery from "./pages/event-gallery";
import Features from "./pages/features";
import Categories from "./pages/categories";

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
  const dispatch = useDispatch<AppDispatch>();
  const location = window.location;
  console.log(location);
  //const navigateAndClearToken = useNavigateAndClearToken();

  const OnIdle = () => {
    console.log("idle function called");
    //removeItem(AuthConstants());
    return (
      <Navigate to="/login" replace state={{ from: location?.pathname }} />
    );
    //console.log("idle second function called");
    //<Navigate to="/login" replace state={{ from: location?.pathname }} />;
    //navigateAndClearToken();
    //logoutFromHelper(dispatch);
    //logoutOnIdle();
  };
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <IdleTimerProvider timeout={600000} onIdle={OnIdle} crossTab={true}>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route index path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/event-gallery" element={<EventGallery />} />
              <Route
                path="/auditoriums"
                element={<FrontAuditoriumView />}
              />
              <Route
                path="/auditorium/details/:id"
                element={<FrontAuditoriumViewOne />}
              />
              <Route path="*" element={<PageNotFound />} />
            </Route>
            {/*  */}
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
              <Route path="/features" element={<Features />} />
              <Route path="/categories" element={<Categories />} />

            </Route>
            {/* </IdleTimerProvider> */}
          </Routes>
        </IdleTimerProvider>
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
