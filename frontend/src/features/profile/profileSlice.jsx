import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import profileService from "./profileService";


const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    isFullLoading: false,
    response: null,
    data: null,
    message: ''
}

// profile user
export const fetch = createAsyncThunk('profile/fetch', async (thunkAPI) => {
    try {
        const res = await profileService.fetch();
        return res;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// update Profile 
export const update = createAsyncThunk('profile/update', async (data, thunkAPI) => {
    try {
        const res = await profileService.update(data);
        return res;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isFullLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch.pending, (state) => {
                state.isFullLoading = true
            })
            .addCase(fetch.fulfilled, (state, action) => {
                state.isFullLoading = false
                state.isSuccess = action.payload.success || true
                state.message = action.payload.message
                state.response = action.payload.data
            })
            .addCase(fetch.rejected, (state, action) => {
                state.isFullLoading = false
                state.isError = true
                state.message = action.payload
                state.response = null
            })
            .addCase(update.pending, (state) => {
                state.isLoading = true
            })
            .addCase(update.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = action.payload.success || true
                state.message = action.payload.message
                state.data = action.payload.data
                state.response = null
            })
            .addCase(update.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.data = null
            })
    }
})
export const { reset } = profileSlice.actions;

export default profileSlice.reducer;