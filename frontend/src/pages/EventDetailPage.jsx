import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventById } from '../features/events/eventSlice'
import { fetchDiscussions, addDiscussion, deleteDiscussion } from '../features/events/eventSlice'
import toast from 'react-hot-toast'
import { FiCalendar, FiMapPin, FiClock, FiExternalLink, FiSend, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const EventDetailPage = () => {
  const { eventId } = useParams()
  const dispatch = useDispatch()
  const { currentEvent, eventLoading, discussions, discussionLoading } = useSelector((s) => s.events)
  const { userInfo } = useSelector((s) => s.auth)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isAdmin = userInfo?.email === 'admin@gmail.com'
  const eventDiscussions = discussions[eventId] || []

  useEffect(() => {
    dispatch(fetchEventById(eventId))
    dispatch(fetchDiscussions(eventId))
  }, [dispatch, eventId])

  const handleAddMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    if (!userInfo) { toast.error('Please login to join the discussion'); return }
    setSubmitting(true)
    try {
      await dispatch(addDiscussion({ eventId, message })).unwrap()
      setMessage('')
      toast.success('Message posted!')
    } catch (err) {
      toast.error(err || 'Failed to post message')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (discussionId) => {
    try {
      await dispatch(deleteDiscussion({ eventId, discussionId })).unwrap()
      toast.success('Message deleted')
    } catch (err) {
      toast.error(err || 'Failed to delete')
    }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })

  const formatTime = (time) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const formatMsgTime = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const avatarColors = [
    'linear-gradient(135deg, #60a5fa, #2563eb)',
    'linear-gradient(135deg, #a78bfa, #7c3aed)',
    'linear-gradient(135deg, #34d399, #059669)',
    'linear-gradient(135deg, #fb923c, #ea580c)',
    'linear-gradient(135deg, #f472b6, #db2777)',
  ]

  if (eventLoading) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '88px 16px 40px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9' }}>
          <div style={{ height: '200px', backgroundColor: '#f1f5f9', borderRadius: '12px', marginBottom: '20px' }} />
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '14px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '10px', width: `${60 + i * 10}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!currentEvent) return null

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '88px 16px 40px' }}>

      {/* Back button */}
      <Link to="/events" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '13px', color: '#64748b', textDecoration: 'none',
        marginBottom: '20px', fontWeight: 500
      }}>
        <FiArrowLeft size={14} /> Back to Events
      </Link>

      {/* Event details card */}
      <div style={{
        backgroundColor: 'white', borderRadius: '20px',
        border: '1px solid #f1f5f9', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px'
      }}>
        {/* Poster */}
        {currentEvent.posterImage ? (
          <img src={currentEvent.posterImage} alt={currentEvent.title}
            style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
        ) : (
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiCalendar style={{ color: 'rgba(255,255,255,0.5)' }} size={60} />
          </div>
        )}

        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: 1.3 }}>
            {currentEvent.title}
          </h1>

          {/* Meta info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            {[
              { icon: <FiCalendar size={13} style={{ color: '#3b82f6' }} />, text: formatDate(currentEvent.date) },
              { icon: <FiClock size={13} style={{ color: '#8b5cf6' }} />, text: formatTime(currentEvent.time) },
              { icon: <FiMapPin size={13} style={{ color: '#ef4444' }} />, text: currentEvent.venue },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: '#f8fafc', padding: '6px 12px',
                borderRadius: '8px', fontSize: '13px', color: '#374151'
              }}>
                {item.icon} {item.text}
              </div>
            ))}
          </div>

          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, marginBottom: '20px' }}>
            {currentEvent.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Organized by <strong style={{ color: '#0f172a' }}>{currentEvent.organizer}</strong>
            </p>
            {currentEvent.registrationLink && (
              <a href={currentEvent.registrationLink} target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', backgroundColor: '#2563eb', color: 'white',
                borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                textDecoration: 'none', boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
              }}>
                <FiExternalLink size={14} /> Register Now
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Discussion Section */}
      <div style={{
        backgroundColor: 'white', borderRadius: '20px',
        border: '1px solid #f1f5f9', padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
          💬 Event Discussion
        </h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
          Find teammates, ask questions, and coordinate participation
        </p>

        {/* Message input */}
        {userInfo ? (
          <form onSubmit={handleAddMessage} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <div style={{
              width: '36px', height: '36px', flexShrink: 0,
              background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                {userInfo.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
              <input
                type="text" value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question or find teammates..."
                style={{
                  flex: 1, fontSize: '13px', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: '12px',
                  outline: 'none', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc'
                }}
              />
              <button type="submit" disabled={submitting || !message.trim()} style={{
                padding: '10px 16px', backgroundColor: '#2563eb', color: 'white',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
                opacity: (!message.trim() || submitting) ? 0.5 : 1
              }}>
                <FiSend size={14} />
              </button>
            </div>
          </form>
        ) : (
          <div style={{
            padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px',
            border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '20px'
          }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Login</Link> to join the discussion
            </p>
          </div>
        )}

        {/* Messages */}
        {discussionLoading && eventDiscussions.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: '#f1f5f9', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '30%', marginBottom: '8px' }} />
                  <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '4px', width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : eventDiscussions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>💭</div>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {eventDiscussions.map((d, idx) => {
              const isOwner = userInfo && d.author?._id === userInfo._id
              const canDelete = isAdmin || isOwner
              return (
                <div key={d._id} style={{ display: 'flex', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', flexShrink: 0,
                    background: avatarColors[idx % avatarColors.length],
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
                      {d.author?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: '12px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{d.author?.name}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{formatMsgTime(d.createdAt)}</span>
                        {d.author?.department && (
                          <span style={{
                            fontSize: '10px', backgroundColor: '#eff6ff', color: '#2563eb',
                            padding: '1px 6px', borderRadius: '10px', fontWeight: 500
                          }}>
                            {d.author.department}
                          </span>
                        )}
                      </div>
                      {canDelete && (
                        <button onClick={() => handleDelete(d._id)} style={{
                          padding: '3px 6px', backgroundColor: 'transparent',
                          border: 'none', color: '#cbd5e1', cursor: 'pointer', borderRadius: '6px'
                        }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
                        >
                          <FiTrash2 size={12} />
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>{d.message}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetailPage