import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import bookingReducer from './slices/bookingSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import { injectStore } from '../services/api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    bookings: bookingReducer,
    chat: chatReducer,
    notifications: notificationReducer
  }
});

// Inject store reference directly to the Axios API service instance
injectStore(store);

export default store;
