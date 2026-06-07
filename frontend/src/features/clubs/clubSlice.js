import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchClubs = createAsyncThunk('clubs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/api/clubs');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch clubs');
  }
});

export const createClub=createAsyncThunk('clubs/create', async (clubData , { rejectWithValue })=>{
  try{
    const {data}=await API.post('/api/clubs', clubData);
    return data;
  }catch(e){
    return rejectWithValue(e.response?.data?.message || 'Failed to create club');
  }
});

const clubSlice = createSlice({
  name: 'clubs',
  initialState: { clubs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubs.pending, (state) => { state.loading = true; state.error=null;})
      .addCase(fetchClubs.fulfilled, (state, action) => { state.loading = false; state.clubs = action.payload; })
      .addCase(fetchClubs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createClub.pending, (state) => {state.loading = true; state.error = null;})
      .addCase(createClub.fulfilled,(state,action)=>{state.loading=false; state.clubs.push(action.payload)})
      .addCase(createClub.rejected, (state, action) => {state.loading = false;state.error = action.payload;});
  },
});

export default clubSlice.reducer;
