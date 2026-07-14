import { useDispatch, useSelector } from 'react-redux'
import { upvoteIssue, clearSimilarity, createIssue } from '../features/issues/issueSlice'
import toast from 'react-hot-toast'
import { FiArrowUp, FiX, FiAlertTriangle } from 'react-icons/fi'

const statusColors = {
  Pending: { bg: '#fef9c3', color: '#a16207' },
  'In Progress': { bg: '#dbeafe', color: '#1d4ed8' },
  Resolved: { bg: '#dcfce7', color: '#15803d' },
}

const SimilarIssuesModal = ({ formData, onClose, onPosted }) => {
  const dispatch = useDispatch()
  const { similarIssues } = useSelector((s) => s.issues)
  const { userInfo } = useSelector((s) => s.auth)

  const handleUpvote = async (issueId) => {
    try {
      await dispatch(upvoteIssue(issueId)).unwrap()
      toast.success('Upvoted successfully!')
      dispatch(clearSimilarity())
      onClose()
    } catch (err) {
      toast.error(err || 'Failed to upvote')
    }
  }

  const handlePostAnyway = async () => {
    try {
      await dispatch(createIssue(formData)).unwrap()
      toast.success('Issue posted!')
      dispatch(clearSimilarity())
      onClose()
      onPosted()
    } catch (err) {
      toast.error(err || 'Failed to post issue')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '20px',
        width: '100%', maxWidth: '560px',
        maxHeight: '85vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', backgroundColor: '#fffbeb',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiAlertTriangle style={{ color: '#d97706' }} size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Similar Issues Found
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Consider supporting an existing issue instead
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{
            padding: '6px', border: 'none', backgroundColor: '#f1f5f9',
            borderRadius: '8px', cursor: 'pointer', color: '#64748b',
          }}>
            <FiX size={16} />
          </button>
        </div>

        {/* Info banner */}
        <div style={{
          margin: '16px 24px', padding: '12px 16px',
          backgroundColor: '#fffbeb', borderRadius: '10px',
          border: '1px solid #fde68a',
        }}>
          <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.5 }}>
            We found issues similar to yours. Upvoting existing issues increases their
            priority and gets them resolved faster.
          </p>
        </div>

        {/* Similar issues list */}
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {similarIssues.map((issue) => {
            const sc = statusColors[issue.status] || statusColors.Pending
            const hasUpvoted = userInfo && issue.upvotes?.includes(userInfo._id)
            return (
              <div key={issue._id} style={{
                border: '1px solid #f1f5f9', borderRadius: '14px',
                padding: '16px', backgroundColor: '#fafafa',
              }}>
                {/* Similarity badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700,
                    backgroundColor: '#f0fdf4', color: '#16a34a',
                    padding: '3px 10px', borderRadius: '20px', border: '1px solid #bbf7d0',
                  }}>
                    {issue.similarityPercent}% similar
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: 600,
                    backgroundColor: sc.bg, color: sc.color,
                    padding: '3px 10px', borderRadius: '20px',
                  }}>
                    {issue.status}
                  </span>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {issue.title}
                </h4>

                {/* Description */}
                <p style={{
                  fontSize: '12px', color: '#64748b', lineHeight: 1.5, marginBottom: '10px',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {issue.description}
                </p>

                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                    <FiArrowUp size={13} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>
                      {issue.upvotes?.length || 0} upvotes
                    </span>
                  </div>
                  <button
                    onClick={() => handleUpvote(issue._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '7px 14px', borderRadius: '9px', border: 'none',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      backgroundColor: hasUpvoted ? '#2563eb' : '#eff6ff',
                      color: hasUpvoted ? 'white' : '#2563eb',
                    }}
                  >
                    <FiArrowUp size={12} />
                    {hasUpvoted ? 'Upvoted' : 'Upvote This'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer buttons */}
        <div style={{
          padding: '20px 24px', borderTop: '1px solid #f1f5f9', marginTop: '16px',
          display: 'flex', gap: '10px',
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', border: '1px solid #e2e8f0',
            borderRadius: '12px', fontSize: '14px', fontWeight: 500,
            color: '#64748b', backgroundColor: 'white', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handlePostAnyway} style={{
            flex: 1, padding: '11px', border: 'none',
            borderRadius: '12px', fontSize: '14px', fontWeight: 600,
            color: 'white', backgroundColor: '#2563eb', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
          }}>
            Post Anyway
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimilarIssuesModal