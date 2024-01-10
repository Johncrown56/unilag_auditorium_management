import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authslice";
import profileReducer from "../features/profile/profileSlice";
import userReducer from "../features/users/userSlice";
import auditoriumReducer from "../features/auditoriums/auditoriumSlice";
import bookingReducer from "../features/bookings/bookingSlice";
import reportReducer from "../features/report/reportSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    users: userReducer,
    auditorium: auditoriumReducer,
    booking: bookingReducer,
    report: reportReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
