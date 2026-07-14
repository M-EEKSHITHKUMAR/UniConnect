import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import issueReducer from '../features/issues/issueSlice';
import clubReducer from '../features/clubs/clubSlice';
import alumniReducer from '../features/alumni/alumniSlice';
import eventReducer from '../features/events/eventSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issueReducer,
    clubs: clubReducer,
    alumni: alumniReducer,
    events: eventReducer,
  },
});

export default store;