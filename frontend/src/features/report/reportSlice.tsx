import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reportService from "./reportService";

const initialState = {
  isError: false,
  isSuccess: false,
  isFullLoading: false,
  data: null,
  message: "",
};

// fetch all users fetchOne
export const countUser = createAsyncThunk(
  "users/countUser",
  async (_, thunkAPI) => {
    try {
      const res = await reportService.countUser();
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

export const reportSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.isFullLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(countUser.pending, (state) => {
        state.isFullLoading = true;
      })
      .addCase(countUser.fulfilled, (state, action) => {
        state.isFullLoading = false;
        state.isSuccess = action.payload.success;
        state.message = action.payload.message;
        state.data = action.payload.data;
      })
      .addCase(countUser.rejected, (state, action: any) => {
        state.isFullLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.data = null;
      });
  },
});
export const { reset } = reportSlice.actions;

export default reportSlice.reducer;
