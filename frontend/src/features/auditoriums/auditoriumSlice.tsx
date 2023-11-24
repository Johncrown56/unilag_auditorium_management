import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auditoriumService from "./auditoriumService";
import { IAuditorium, IBooking } from "../../utils/interfaces";

const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  isFullLoading: false,
  data: null,
  message: "",
  type: "",
};

// create auditorium
export const create = createAsyncThunk(
  "auditorium/create",
  async (data: IAuditorium, thunkAPI) => {
    try {
      const res = await auditoriumService.create(data);
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

// fetch auditorium
export const fetch = createAsyncThunk(
  "auditorium/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await auditoriumService.fetch();
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

// update auditorium
export const update = createAsyncThunk(
  "auditorium/update",
  async (data: IAuditorium, thunkAPI) => {
    try {
      const res = await auditoriumService.update(data);
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

// fetch one auditorium
export const fetchOne = createAsyncThunk(
  "auditorium/fetchOne",
  async (id: string, thunkAPI) => {
    try {
      return await auditoriumService.fetchOne(id);
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

export const auditoriumSlice = createSlice({
  name: "auditorium",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isFullLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
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
      });
  },
});
export const { reset } = auditoriumSlice.actions;

export default auditoriumSlice.reducer;
