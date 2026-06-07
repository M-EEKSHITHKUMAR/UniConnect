import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrending } from '../features/issues/issueSlice'
import IssueCard from '../components/IssueCard'
import SkeletonCard from '../components/SkeletonCard'
import { FiTrendingUp } from 'react-icons/fi'

const TrendingPage = () => {
  const dispatch = useDispatch()
  const { trending, trendingLoading } = useSelector((state) => state.issues)

  useEffect(() => {
    // ✅ Only fetch if no trending data cached
    if (trending.length === 0) {
      dispatch(fetchTrending())
    }
  }, [dispatch, trending.length])

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '88px 16px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '44px', height: '44px', backgroundColor: '#fff7ed',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FiTrendingUp style={{ color: '#f97316' }} size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Trending Issues</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Top pending issues from the last 24 hours</p>
        </div>
      </div>

      {trendingLoading && trending.length === 0 ? (
        // ✅ Only show skeleton on first load
        <div>{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : trending.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
          padding: '48px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔥</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No trending issues</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>No pending issues posted in the last 24 hours</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {trending.map((issue, idx) => (
            <div key={issue._id} style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{
                position: 'absolute', left: '-10px', top: '16px',
                width: '28px', height: '28px',
                background: 'linear-gradient(135deg, #f97316, #ef4444)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 10,
                boxShadow: '0 2px 6px rgba(249,115,22,0.4)'
              }}>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>#{idx + 1}</span>
              </div>
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrendingPage