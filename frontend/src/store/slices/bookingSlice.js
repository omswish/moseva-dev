import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch booking details');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to apply for job');
    }
  }
);

export const acceptBooking = createAsyncThunk(
  'bookings/acceptBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/accept`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to accept booking');
    }
  }
);

export const rejectBooking = createAsyncThunk(
  'bookings/rejectBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/reject`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to reject booking');
    }
  }
);

export const completeBooking = createAsyncThunk(
  'bookings/completeBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/complete`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to complete booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ bookingId, cancellationReason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`, { cancellationReason });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to cancel booking');
    }
  }
);

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Booking By ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Booking
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.unshift(action.payload);
      })
      // Accept / Reject / Complete / Cancel
      .addCase(acceptBooking.fulfilled, (state, action) => {
        if (state.currentBooking && state.currentBooking.bookingId === action.payload.bookingId) {
          state.currentBooking = action.payload;
        }
        const index = state.bookings.findIndex(b => b.bookingId === action.payload.bookingId);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        if (state.currentBooking && state.currentBooking.bookingId === action.payload.bookingId) {
          state.currentBooking = action.payload;
        }
        const index = state.bookings.findIndex(b => b.bookingId === action.payload.bookingId);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        if (state.currentBooking && state.currentBooking.bookingId === action.payload.bookingId) {
          state.currentBooking = action.payload;
        }
        const index = state.bookings.findIndex(b => b.bookingId === action.payload.bookingId);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        if (state.currentBooking && state.currentBooking.bookingId === action.payload.bookingId) {
          state.currentBooking = action.payload;
        }
        const index = state.bookings.findIndex(b => b.bookingId === action.payload.bookingId);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  }
});

export const { clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
