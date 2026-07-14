import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIssues, fetchTrending } from '../features/issues/issueSlice'
import IssueCard from '../components/IssueCard'
import SkeletonCard from '../components/SkeletonCard'
import { FiTrendingUp, FiClock } from 'react-icons/fi'

const TrendingPage = () => {
  const dispatch = useDispatch()
  const { issues, loading, trending, trendingLoading } = useSelector((state) => state.issues)

  useEffect(() => {
    if (trending.length === 0) dispatch(fetchTrending())
    if (issues.length === 0) dispatch(fetchIssues())
  }, [dispatch, trending.length, issues.length])

  const trendingIds = new Set(trending.map((i) => i._id))
  const pendingIssues = issues
    .filter((i) => i.status === 'Pending' && !trendingIds.has(i._id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '88px 16px 40px' }}>

      {/* ── Section 1: Trending Last 24h ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          width: '44px', height: '44px', backgroundColor: '#fff7ed',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FiTrendingUp style={{ color: '#f97316' }} size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Trending Issues</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Top 10 most upvoted pending issues in the last 24 hours</p>
        </div>
      </div>

      {trendingLoading && trending.length === 0 ? (
        <div style={{ marginBottom: '48px' }}>
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : trending.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
          padding: '36px', textAlign: 'center', marginBottom: '48px'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔥</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            No trending issues right now
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            No pending issues were posted in the last 24 hours
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
          {trending.map((issue, idx) => (
            <div key={issue._id} style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{
                position: 'absolute', left: '-10px', top: '16px',
                width: '28px', height: '28px',
                background: idx === 0
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : idx === 1
                    ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                    : idx === 2
                      ? 'linear-gradient(135deg, #fb923c, #ea580c)'
                      : 'linear-gradient(135deg, #f97316, #ef4444)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 10,
                boxShadow: '0 2px 6px rgba(249,115,22,0.4)'
              }}>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>
                  #{idx + 1}
                </span>
              </div>
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>
      )}

      
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px', height: '36px', backgroundColor: '#f0fdf4',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiClock style={{ color: '#16a34a' }} size={18} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
            All Pending Issues
          </span>
        </div>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
      </div>

      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
        All unresolved pending issues — oldest to newest
      </p>

      
      {loading && issues.length === 0 ? (
        <div>{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : pendingIssues.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
          padding: '36px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            No pending issues
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            All campus issues have been resolved!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Count badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{
              fontSize: '12px', fontWeight: 600,
              backgroundColor: '#fef9c3', color: '#a16207',
              padding: '4px 12px', borderRadius: '20px',
              border: '1px solid #fde68a'
            }}>
              {pendingIssues.length} pending issue{pendingIssues.length !== 1 ? 's' : ''}
            </span>
          </div>
          {pendingIssues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TrendingPage