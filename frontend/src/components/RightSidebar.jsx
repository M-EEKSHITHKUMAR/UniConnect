import { useEffect } from "react"
import { FiTrendingUp, FiArrowUp } from 'react-icons/fi'
import { useDispatch, useSelector } from "react-redux"
import { fetchTrending } from "../features/issues/issueSlice"


const statusColors = {
  Pending: { bg: '#fef9c3', color: '#a16207' },
  'In Progress': { bg: '#dbeafe', color: '#1d4ed8' },
  Resolved: { bg: '#dcfce7', color: '#15803d' },
}

const RightSidebar = () => {
    const dispatch=useDispatch();
    const {trending,trendingLoading}=useSelector((state)=>state.issues);
    useEffect(()=>{dispatch(fetchTrending())},[dispatch]);

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px',
      border: '1px solid #f1f5f9', padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      position: 'sticky', top: '80px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{
          width: '28px', height: '28px', backgroundColor: '#fff7ed',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FiTrendingUp style={{ color: '#f97316' }} size={14} />
        </div>
        <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>Trending Issues</h3>
      </div>
      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '16px' }}>
        Top pending issues in last 24h
      </p>

      {trendingLoading ? (
        <div>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '75%', marginBottom: '6px' }} />
              <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '50%' }} />
            </div>
          ))}
        </div>
      ) : trending.length === 0 ? (
        <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>
          No trending issues in the last 24 hours
        </p>
      ) : (
        <div>
          {trending.map((issue, idx) => (
            <div key={issue._id} style={{
              display: 'flex', gap: '10px', padding: '10px',
              borderRadius: '10px', marginBottom: '4px',
              cursor: 'pointer', transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginTop: '2px', minWidth: '16px' }}>
                #{idx + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '12px', fontWeight: 600, color: '#1e293b',
                  lineHeight: 1.4, overflow: 'hidden',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                }}>
                  {issue.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#3b82f6' }}>
                    <FiArrowUp size={10} />
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{issue.upvotes?.length || 0}</span>
                  </div>
                  <span style={{
                    fontSize: '10px', padding: '1px 6px', borderRadius: '20px', fontWeight: 600,
                    backgroundColor: statusColors[issue.status]?.bg,
                    color: statusColors[issue.status]?.color
                  }}>
                    {issue.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RightSidebar