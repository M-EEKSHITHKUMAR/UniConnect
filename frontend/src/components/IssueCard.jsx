import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { upvoteIssue, updateStatus, deleteIssue } from '../features/issues/issueSlice'
import CommentSection from './CommentSection'
import toast from 'react-hot-toast'
import { FiArrowUp, FiMessageSquare, FiTrash2, FiChevronDown, FiChevronUp, FiClock } from 'react-icons/fi'

const statusConfig = {
  Pending: { bg: '#fef9c3', color: '#a16207', border: '#fde68a' },
  'In Progress': { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
  Resolved: { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
}

const IssueCard = ({ issue }) => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)
  const [showComments, setShowComments] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)

  const isAdmin = userInfo?.email === 'admin@gmail.com'
  const hasUpvoted = userInfo && issue.upvotes?.includes(userInfo._id)
  const sc = statusConfig[issue.status] || statusConfig.Pending

  const handleUpvote = async () => {
    if (!userInfo) { toast.error('Please login to upvote'); return }
    try { await dispatch(upvoteIssue(issue._id)).unwrap() }
    catch (err) { toast.error(err || 'Failed to upvote') }
  }

  const handleStatusChange = async (e) => {
    setStatusUpdating(true)
    try {
      await dispatch(updateStatus({ id: issue._id, status: e.target.value })).unwrap()
      toast.success(`Status updated to ${e.target.value}`)
    } catch (err) { toast.error(err || 'Failed') }
    finally { setStatusUpdating(false) }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this resolved issue?')) return
    try { await dispatch(deleteIssue(issue._id)).unwrap(); toast.success('Issue deleted') }
    catch (err) { toast.error(err || 'Failed to delete') }
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const imageUrl = issue.image ? `${import.meta.env.VITE_API_URL}${issue.image}` : null

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px',
      border: '1px solid #f1f5f9', overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s', marginBottom: '4px'
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}
    >
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', flexShrink: 0,
              background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>
                {issue.author?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{issue.author?.name}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>{issue.author?.department}</p>
            </div>
          </div>
          <span style={{
            fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: 600,
            backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
          }}>
            {issue.status}
          </span>
        </div>

        {/* Content */}
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: 1.4 }}>
          {issue.title}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '12px' }}>
          {issue.description}
        </p>

        {/* Image */}
        {imageUrl && (
          <div style={{ marginBottom: '12px', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={imageUrl} alt="Issue" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '11px', marginBottom: '16px' }}>
          <FiClock size={11} />
          <span>{formatDate(issue.createdAt)}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleUpvote} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px', border: 'none',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
            backgroundColor: hasUpvoted ? '#2563eb' : '#f1f5f9',
            color: hasUpvoted ? 'white' : '#64748b',
          }}>
            <FiArrowUp size={14} />
            <span>{issue.upvotes?.length || 0}</span>
          </button>

          <button onClick={() => setShowComments(!showComments)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px', border: 'none',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            backgroundColor: '#f1f5f9', color: '#64748b', transition: 'all 0.2s'
          }}>
            <FiMessageSquare size={14} />
            <span>Comments</span>
            {showComments ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
          </button>

          {/* Admin controls */}
          {isAdmin && (
            <>
              <select value={issue.status} onChange={handleStatusChange} disabled={statusUpdating}
                style={{
                  marginLeft: 'auto', fontSize: '12px', padding: '8px 12px',
                  border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: 'white',
                  color: '#374151', cursor: 'pointer', outline: 'none'
                }}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              {issue.status === 'Resolved' && (
                <button onClick={handleDelete} style={{
                  padding: '8px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer'
                }}>
                  <FiTrash2 size={14} />
                </button>
              )}
            </>
          )}
        </div>

        {showComments && <CommentSection issueId={issue._id} />}
      </div>
    </div>
  )
}

export default IssueCard