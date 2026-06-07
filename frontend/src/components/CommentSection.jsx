import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { FiSend } from 'react-icons/fi'

const CommentSection = ({ issueId }) => {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try { const { data } = await API.get(`/api/issues/${issueId}/comments`); setComments(data) }
      catch { toast.error('Failed to load comments') }
      finally { setLoading(false) }
    }
    load()
  }, [issueId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    if (!userInfo) { toast.error('Please login to comment'); return }
    setSubmitting(true)
    try {
      const { data } = await API.post(`/api/issues/${issueId}/comments`, { text })
      setComments((prev) => [...prev, data]); setText(''); toast.success('Comment added!')
    } catch { toast.error('Failed to add comment') }
    finally { setSubmitting(false) }
  }

  const formatTime = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
      {userInfo && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            width: '30px', height: '30px', flexShrink: 0,
            background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>
              {userInfo.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
            <input
              type="text" value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1, fontSize: '13px', padding: '8px 12px',
                border: '1px solid #e2e8f0', borderRadius: '10px',
                outline: 'none', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif'
              }}
            />
            <button type="submit" disabled={submitting || !text.trim()} style={{
              padding: '8px 12px', backgroundColor: '#2563eb', color: 'white',
              border: 'none', borderRadius: '10px', cursor: 'pointer', opacity: (!text.trim() || submitting) ? 0.5 : 1
            }}>
              <FiSend size={13} />
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '8px 0' }}>
          No comments yet. Be the first!
        </p>
      ) : (
        <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {comments.map((c) => (
            <div key={c._id} style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', flexShrink: 0,
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 600 }}>
                  {c.author?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: '10px', padding: '8px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{c.author?.name}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{formatTime(c.createdAt)}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#4b5563' }}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection