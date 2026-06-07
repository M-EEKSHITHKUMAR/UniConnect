import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchIssues = createAsyncThunk('issues/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/api/issues');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch issues');
  }
});

export const fetchTrending = createAsyncThunk('issues/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/api/issues/trending');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch trending');
  }
});

export const createIssue = createAsyncThunk('issues/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/api/issues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create issue');
  }
});

export const upvoteIssue = createAsyncThunk('issues/upvote', async (issueId, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/api/issues/${issueId}/upvote`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to upvote');
  }
});

export const updateStatus = createAsyncThunk('issues/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/api/issues/${id}/status`, { status });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const deleteIssue = createAsyncThunk('issues/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/api/issues/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete issue');
  }
});

const issueSlice = createSlice({
  name: 'issues',
  initialState: {
    issues: [],
    trending: [],
    loading: false,
    trendingLoading: false,
    error: null,
  },
  reducers: {
    clearIssueError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => { state.loading = true; })
      .addCase(fetchIssues.fulfilled, (state, action) => { state.loading = false; state.issues = action.payload; })
      .addCase(fetchIssues.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTrending.pending, (state) => { state.trendingLoading = true; })
      .addCase(fetchTrending.fulfilled, (state, action) => { state.trendingLoading = false; state.trending = action.payload; })
      .addCase(fetchTrending.rejected, (state) => { state.trendingLoading = false; })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.issues.unshift(action.payload);
      })
      .addCase(upvoteIssue.fulfilled, (state, action) => {
        const idx = state.issues.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.issues[idx] = action.payload;
        const tidx = state.trending.findIndex((i) => i._id === action.payload._id);
        if (tidx !== -1) state.trending[tidx] = action.payload;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const idx = state.issues.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.issues[idx] = action.payload;
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.issues = state.issues.filter((i) => i._id !== action.payload);
      });
  },
});

export const { clearIssueError } = issueSlice.actions;
export default issueSlice.reducer;