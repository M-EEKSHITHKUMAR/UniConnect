import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/api/auth/send-otp', { email });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/api/auth/verify-otp', { email, otp });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid OTP');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/api/auth/register', userData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/api/auth/login', userData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.put('/api/auth/profile', userData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo,
    loading: false,
    error: null,
    otpSent: false,
    otpVerified: false,
    otpLoading: false,
    otpError: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
      state.otpError = null;
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.otpLoading = false;
      state.otpError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(sendOtp.pending, (state) => { state.otpLoading = true; state.otpError = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.otpLoading = false; state.otpSent = true; })
      .addCase(sendOtp.rejected, (state, action) => { state.otpLoading = false; state.otpError = action.payload; })

      .addCase(verifyOtp.pending, (state) => { state.otpLoading = true; state.otpError = null; })
      .addCase(verifyOtp.fulfilled, (state) => { state.otpLoading = false; state.otpVerified = true; })
      .addCase(verifyOtp.rejected, (state, action) => { state.otpLoading = false; state.otpError = action.payload; })

      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateProfile.pending, (state) => { state.loading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.loading = false; state.userInfo = action.payload; })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, clearError, resetOtpState } = authSlice.actions;
export default authSlice.reducer;