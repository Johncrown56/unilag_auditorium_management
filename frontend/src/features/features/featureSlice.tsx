import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import featureService from "./featureService";
import { IFeat } from "../../utils/interfaces";

const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  isFullLoading: false,
  response: null,
  data: null,
  message: "",
};

// create features
export const create = createAsyncThunk(
    "feature/create",
    async (data: IFeat, thunkAPI) => {
      try {
        const res = await featureService.create(data);
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

// fetch all features
export const fetch = createAsyncThunk("feature/fetch", async (_, thunkAPI) => {
  try {
    const res = await featureService.fetch();
    return res;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// update features
export const update = createAsyncThunk(
  "feature/update",
  async (data: IFeat, thunkAPI) => {
    try {
      const res = await featureService.update(data.id!, {...data});
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

// delete features
export const remove = createAsyncThunk(
    "feature/remove",
    async (id: string, thunkAPI) => {
      try {
        const res = await featureService.remove(id);
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

export const featureSlice = createSlice({
  name: "feature",
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
        state.isSuccess = action.payload.success || true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.response = null;
      })
      .addCase(create.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
        state.data = null;
      })
      .addCase(fetch.pending, (state) => {
        state.isFullLoading = true;
      })
      .addCase(fetch.fulfilled, (state, action) => {
        state.isFullLoading = false;
        state.isSuccess = action.payload.success || true;
        state.message = action.payload.message;
        state.response = action.payload.data;
      })
      .addCase(fetch.rejected, (state, action) => {
        state.isFullLoading = false;
        state.isError = true;
        state.message = String(action.payload);
        state.response = null;
      })
      .addCase(update.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success || true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.response = null;
      })
      .addCase(update.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
        state.data = null;
      })
      .addCase(remove.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(remove.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = action.payload.success || true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.response = null;
      })
      .addCase(remove.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
        state.data = null;
      });
  },
});
export const { reset } = featureSlice.actions;

export default featureSlice.reducer;
