import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const fetchEvents = createAsyncThunk('events/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/api/events')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch events')
  }
})

export const fetchEventById = createAsyncThunk('events/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/api/events/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch event')
  }
})

export const createEvent = createAsyncThunk('events/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/api/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create event')
  }
})

export const deleteEvent = createAsyncThunk('events/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/api/events/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete event')
  }
})

export const fetchDiscussions = createAsyncThunk('events/fetchDiscussions', async (eventId, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/api/events/${eventId}/discussions`)
    return { eventId, discussions: data }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch discussions')
  }
})

export const addDiscussion = createAsyncThunk('events/addDiscussion', async ({ eventId, message }, { rejectWithValue }) => {
  try {
    const { data } = await API.post(`/api/events/${eventId}/discussions`, { message })
    return { eventId, discussion: data }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add message')
  }
})

export const deleteDiscussion = createAsyncThunk('events/deleteDiscussion', async ({ eventId, discussionId }, { rejectWithValue }) => {
  try {
    await API.delete(`/api/events/${eventId}/discussions/${discussionId}`)
    return { eventId, discussionId }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete message')
  }
})

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    currentEvent: null,
    discussions: {},
    loading: false,
    eventLoading: false,
    discussionLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentEvent: (state) => { state.currentEvent = null },
    clearEventError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true })
      .addCase(fetchEvents.fulfilled, (state, action) => { state.loading = false; state.events = action.payload })
      .addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchEventById.pending, (state) => { state.eventLoading = true })
      .addCase(fetchEventById.fulfilled, (state, action) => { state.eventLoading = false; state.currentEvent = action.payload })
      .addCase(fetchEventById.rejected, (state, action) => { state.eventLoading = false; state.error = action.payload })

      .addCase(createEvent.fulfilled, (state, action) => { state.events.unshift(action.payload) })

      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload)
      })

      .addCase(fetchDiscussions.pending, (state) => { state.discussionLoading = true })
      .addCase(fetchDiscussions.fulfilled, (state, action) => {
        state.discussionLoading = false
        state.discussions[action.payload.eventId] = action.payload.discussions
      })
      .addCase(fetchDiscussions.rejected, (state) => { state.discussionLoading = false })

      .addCase(addDiscussion.fulfilled, (state, action) => {
        const { eventId, discussion } = action.payload
        if (!state.discussions[eventId]) state.discussions[eventId] = []
        state.discussions[eventId].push(discussion)
      })

      .addCase(deleteDiscussion.fulfilled, (state, action) => {
        const { eventId, discussionId } = action.payload
        if (state.discussions[eventId]) {
          state.discussions[eventId] = state.discussions[eventId].filter(
            (d) => d._id !== discussionId
          )
        }
      })
  },
})

export const { clearCurrentEvent, clearEventError } = eventSlice.actions
export default eventSlice.reducer