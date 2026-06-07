import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIssues } from '../features/issues/issueSlice'
import IssueCard from '../components/IssueCard'
import CreateIssueForm from '../components/CreateIssueForm'
import LeftSidebar from '../components/LeftSidebar'
import RightSidebar from '../components/RightSidebar'
import SkeletonCard from '../components/SkeletonCard'

const HomePage = () => {
  const dispatch = useDispatch()
  const { issues, loading } = useSelector((state) => state.issues)

  useEffect(() => {
    // ✅ Only fetch if no data cached yet
    if (issues.length === 0) {
      dispatch(fetchIssues())
    }
  }, [dispatch, issues.length])

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '80px 16px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="home-grid">
        <div className="left-sidebar">
          <LeftSidebar />
        </div>
        <main className="main-feed">
          <CreateIssueForm />
          {loading && issues.length === 0 ? (
            // ✅ Only show skeleton on FIRST load, not on revisit
            <div>{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : issues.length === 0 ? (
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              border: '1px solid #f1f5f9', padding: '48px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No issues yet</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>Be the first to report a campus issue!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {issues.map((issue) => <IssueCard key={issue._id} issue={issue} />)}
            </div>
          )}
        </main>
        <div className="right-sidebar">
          <RightSidebar />
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .home-grid { grid-template-columns: 280px 1fr 280px !important; }
          .left-sidebar { display: block !important; }
          .right-sidebar { display: block !important; }
        }
        @media (max-width: 1023px) {
          .left-sidebar { display: none !important; }
          .right-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default HomePage