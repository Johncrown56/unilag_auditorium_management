import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IBooking, IRequest } from "../../utils/interfaces";
import bookingService from "./bookingService";

const initialState: IRequest = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  isFullLoading: false,
  data: null,
  message: "",
  type: "",
};

// create booking
export const create = createAsyncThunk(
  "booking/create",
  async (data: IBooking, thunkAPI) => {
    try {
      const res = await bookingService.create(data);
      return res;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// fetch booking
export const fetch = createAsyncThunk("booking/fetch", async (_, thunkAPI) => {
  try {
    const res = await bookingService.fetch();
    return res;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// update booking
export const update = createAsyncThunk(
  "booking/update",
  async (data: IBooking, thunkAPI) => {
    try {
      const res = await bookingService.update(data);
      return res;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// fetch one booking
export const fetchOne = createAsyncThunk(
  "booking/fetchOne",
  async (id: string, thunkAPI) => {
    try {
      return await bookingService.fetchOne(id);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// fetch all booking bookings per user
export const fetchByUser = createAsyncThunk(
  "booking/fetchByUser",
  async (_, thunkAPI) => {
    try {
      return await bookingService.fetchByUser();
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    reset: (state: IRequest) => {
      state.isLoading = false;
      state.isFullLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.type = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(create.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(create.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.type = action.type;
      })
      .addCase(create.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.data = null;
      })
      .addCase(fetch.pending, (state) => {
        state.isFullLoading = true;
      })
      .addCase(fetch.fulfilled, (state, action) => {
        state.isFullLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.type = action.type;
      })
      .addCase(fetch.rejected, (state, action: any) => {
        state.isFullLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.data = null;
      })
      .addCase(update.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success || true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.type = action.type;
      })
      .addCase(update.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.data = null;
      })
      .addCase(fetchOne.pending, (state) => {
        state.isFullLoading = true;
      })
      .addCase(fetchOne.fulfilled, (state, action) => {
        state.isFullLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.type = action.type;
      })
      .addCase(fetchOne.rejected, (state, action: any) => {
        state.isFullLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.data = null;
      })
      .addCase(fetchByUser.pending, (state) => {
        state.isFullLoading = true;
      })
      .addCase(fetchByUser.fulfilled, (state, action) => {
        state.isFullLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.type = action.type;
      })
      .addCase(fetchByUser.rejected, (state, action: any) => {
        state.isFullLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.data = null;
      });
  },
});
export const { reset } = bookingSlice.actions;

export default bookingSlice.reducer;
