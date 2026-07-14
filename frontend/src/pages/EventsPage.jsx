import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents, createEvent, deleteEvent } from '../features/events/eventSlice'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCalendar, FiMapPin, FiClock, FiExternalLink, FiMessageSquare, FiTrash2, FiPlus, FiX, FiImage } from 'react-icons/fi'

const gradients = [
  'linear-gradient(135deg, #60a5fa, #2563eb)',
  'linear-gradient(135deg, #a78bfa, #7c3aed)',
  'linear-gradient(135deg, #34d399, #059669)',
  'linear-gradient(135deg, #fb923c, #ea580c)',
  'linear-gradient(135deg, #f472b6, #db2777)',
  'linear-gradient(135deg, #2dd4bf, #0d9488)',
]

//Create Event Modal(Admin only)
const CreateEventModal = ({ onClose }) => {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    title: '', description: '', venue: '',
    date: '', time: '', organizer: '', registrationLink: ''
  })
  const [poster, setPoster] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePoster = (e) => {
    const file = e.target.files[0]
    if (file) { setPoster(file); setPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.venue || !form.date || !form.time || !form.organizer) {
      toast.error('Please fill all required fields'); return
    }
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    if (poster) formData.append('posterImage', poster)

    setLoading(true)
    try {
      await dispatch(createEvent(formData)).unwrap()
      toast.success('Event created!')
      onClose()
    } catch (err) {
      toast.error(err || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: '1px solid #e2e8f0', borderRadius: '10px',
    fontSize: '13px', outline: 'none',
    fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '20px',
        width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Create New Event</h2>
          <button onClick={onClose} style={{
            padding: '6px', border: 'none', backgroundColor: '#f1f5f9',
            borderRadius: '8px', cursor: 'pointer', color: '#64748b'
          }}>
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { name: 'title', label: 'Event Title *', placeholder: 'Hackathon 2025', type: 'text' },
            { name: 'organizer', label: 'Organizer *', placeholder: 'Tech Club', type: 'text' },
            { name: 'venue', label: 'Venue *', placeholder: 'Auditorium Block A', type: 'text' },
            { name: 'registrationLink', label: 'Registration Link', placeholder: 'https://forms.google.com/...', type: 'url' },
          ].map((f) => (
            <div key={f.name}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                {f.label}
              </label>
              <input name={f.name} type={f.type} value={form[f.name]}
                onChange={handleChange} placeholder={f.placeholder} style={inputStyle} />
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                Date *
              </label>
              <input name="date" type="date" value={form.date}
                onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                Time *
              </label>
              <input name="time" type="time" value={form.time}
                onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
              Description *
            </label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the event..." rows={3}
              style={{ ...inputStyle, resize: 'none' }} />
          </div>

          {/* Poster upload */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
              Event Poster
            </label>
            {preview ? (
              <div style={{ position: 'relative' }}>
                <img src={preview} alt="Poster preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px' }} />
                <button type="button" onClick={() => { setPoster(null); setPreview(null) }}
                  style={{
                    position: 'absolute', top: '8px', right: '8px', padding: '4px',
                    backgroundColor: 'rgba(0,0,0,0.5)', color: 'white',
                    border: 'none', borderRadius: '50%', cursor: 'pointer'
                  }}>
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '10px',
                cursor: 'pointer', color: '#64748b', fontSize: '13px'
              }}>
                <FiImage size={16} /> Upload Poster
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePoster} />
              </label>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '11px', border: '1px solid #e2e8f0',
              borderRadius: '12px', fontSize: '14px', color: '#64748b',
              backgroundColor: 'white', cursor: 'pointer'
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '11px', border: 'none',
              borderRadius: '12px', fontSize: '14px', fontWeight: 600,
              backgroundColor: '#2563eb', color: 'white', cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

//Events page
const EventsPage = () => {
  const dispatch = useDispatch()
  const { events, loading } = useSelector((s) => s.events)
  const { userInfo } = useSelector((s) => s.auth)
  const [showCreate, setShowCreate] = useState(false)

  const isAdmin = userInfo?.email === 'admin@gmail.com'

  useEffect(() => {
    if (events.length === 0) dispatch(fetchEvents())
  }, [dispatch, events.length])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await dispatch(deleteEvent(id)).unwrap()
      toast.success('Event deleted')
    } catch (err) {
      toast.error(err || 'Failed to delete event')
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  })

  const formatTime = (time) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '88px 16px 40px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', backgroundColor: '#eff6ff',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiCalendar style={{ color: '#2563eb' }} size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Campus Events</h1>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Discover and collaborate on upcoming events</p>
          </div>
        </div>

        {isAdmin && (
          <button onClick={() => setShowCreate(true)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', backgroundColor: '#2563eb', color: 'white',
            border: 'none', borderRadius: '12px', fontSize: '14px',
            fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
          }}>
            <FiPlus size={16} /> Create Event
          </button>
        )}
      </div>

      {/* Events grid */}
      {loading && events.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              backgroundColor: 'white', borderRadius: '16px',
              border: '1px solid #f1f5f9', overflow: 'hidden'
            }}>
              <div style={{ height: '160px', backgroundColor: '#f1f5f9' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ height: '16px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '70%', marginBottom: '10px' }} />
                <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '100%', marginBottom: '6px' }} />
                <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
          padding: '48px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No events yet</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            {isAdmin ? 'Create the first campus event!' : 'Events will appear here when posted by admin'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {events.map((event, idx) => (
            <div key={event._id} style={{
              backgroundColor: 'white', borderRadius: '16px',
              border: '1px solid #f1f5f9', overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {/* Poster */}
              {event.posterImage ? (
                <img src={event.posterImage} alt={event.title}
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  height: '160px', background: gradients[idx % gradients.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FiCalendar style={{ color: 'rgba(255,255,255,0.6)' }} size={40} />
                </div>
              )}

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', lineHeight: 1.3 }}>
                  {event.title}
                </h3>
                <p style={{
                  fontSize: '12px', color: '#64748b', lineHeight: 1.5, marginBottom: '12px',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {event.description}
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                    <FiCalendar size={12} style={{ color: '#3b82f6' }} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                    <FiClock size={12} style={{ color: '#8b5cf6' }} />
                    <span>{formatTime(event.time)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                    <FiMapPin size={12} style={{ color: '#ef4444' }} />
                    <span>{event.venue}</span>
                  </div>
                </div>

                {/* Organizer */}
                <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '14px' }}>
                  By <strong style={{ color: '#374151' }}>{event.organizer}</strong>
                </p>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/events/${event._id}`} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '5px', padding: '9px', backgroundColor: '#f1f5f9',
                    color: '#374151', borderRadius: '10px', fontSize: '12px',
                    fontWeight: 600, textDecoration: 'none'
                  }}>
                    <FiMessageSquare size={13} /> Discussion
                  </Link>

                  {event.registrationLink && (
                    <a href={event.registrationLink} target="_blank" rel="noreferrer" style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '5px', padding: '9px', backgroundColor: '#2563eb',
                      color: 'white', borderRadius: '10px', fontSize: '12px',
                      fontWeight: 600, textDecoration: 'none'
                    }}>
                      <FiExternalLink size={13} /> Register
                    </a>
                  )}

                  {isAdmin && (
                    <button onClick={() => handleDelete(event._id)} style={{
                      padding: '9px 12px', backgroundColor: '#fef2f2',
                      color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer'
                    }}>
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

export default EventsPage