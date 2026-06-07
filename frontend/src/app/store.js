import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import issueReducer from '../features/issues/issueSlice';
import clubReducer from '../features/clubs/clubSlice';
import alumniReducer from '../features/alumni/alumniSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issueReducer,
    clubs: clubReducer,
    alumni: alumniReducer,
  },
});

export default store;