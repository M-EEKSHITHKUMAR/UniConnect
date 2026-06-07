import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchAlumni = createAsyncThunk('alumni/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/api/alumni');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch alumni');
  }
});

export const createAlumni=createAsyncThunk('alumni/create',async (alumniData , { rejectWithValue })=>{
  try{
    const {data}=await API.post('/api/alumni', alumniData);
    return data;
  }catch(e){
    return rejectWithValue(e.response?.data?.message || 'Failed to create Alumni');
  }
})

const alumniSlice = createSlice({
  name: 'alumni',
  initialState: { alumni: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlumni.pending, (state) => { state.loading = true; })
      .addCase(fetchAlumni.fulfilled, (state, action) => { state.loading = false; state.alumni = action.payload; })
      .addCase(fetchAlumni.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createAlumni.pending, (state) => {state.loading = true; state.error = null;})
      .addCase(createAlumni.fulfilled,(state,action)=>{state.loading=false; state.alumni.push(action.payload)})
      .addCase(createAlumni.rejected, (state, action) => {state.loading = false; state.error = action.payload;});
  },
});

export default alumniSlice.reducer;