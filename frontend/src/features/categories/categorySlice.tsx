import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryService from "./categoryService";
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

// create categorys
export const create = createAsyncThunk(
    "category/create",
    async (data: IFeat, thunkAPI) => {
      try {
        const res = await categoryService.create(data);
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

// fetch all categorys
export const fetch = createAsyncThunk("category/fetch", async (_, thunkAPI) => {
  try {
    const res = await categoryService.fetch();
    return res;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// update categorys
export const update = createAsyncThunk(
  "category/update",
  async (data: IFeat, thunkAPI) => {
    try {
      const res = await categoryService.update(data.id!, {...data});
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

// delete categorys
export const remove = createAsyncThunk(
    "category/remove",
    async (id: string, thunkAPI) => {
      try {
        const res = await categoryService.remove(id);
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

export const categorySlice = createSlice({
  name: "category",
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
export const { reset } = categorySlice.actions;

export default categorySlice.reducer;
