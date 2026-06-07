import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../features/auth/authSlice'
import toast from 'react-hot-toast'
import { FiEdit3, FiCheck, FiX } from 'react-icons/fi'

const LeftSidebar = () => {
  const { userInfo } = useSelector((state) => state.auth)
  const { issues } = useSelector((state) => state.issues)
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: userInfo?.name || '',
    department: userInfo?.department || '',
    bio: userInfo?.bio || ''
  })

  const userIssues = issues.filter(
    (i) => i.author?._id === userInfo?._id || i.author === userInfo?._id
  )
  const totalUpvotes = userIssues.reduce((acc, i) => acc + (i.upvotes?.length || 0), 0)

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(form)).unwrap()
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) {
      toast.error(err || 'Update failed')
    }
  }

  if (!userInfo) return null

  const inputStyle = {
    width: '100%', fontSize: '13px', padding: '8px 12px',
    border: '1px solid #e2e8f0', borderRadius: '8px',
    outline: 'none', fontFamily: 'Inter, sans-serif'
  }

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px',
      border: '1px solid #f1f5f9', padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      position: 'sticky', top: '80px'
    }}>
      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '64px', height: '64px', margin: '0 auto 10px',
          background: 'linear-gradient(135deg, #60a5fa, #6366f1, #a855f7)',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
        }}>
          <span style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>
            {userInfo.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        {userInfo.email === 'admin@gmail.com' && (
          <span style={{
            fontSize: '11px', backgroundColor: '#fee2e2', color: '#dc2626',
            padding: '2px 10px', borderRadius: '20px', fontWeight: 600
          }}>Admin</span>
        )}
      </div>

      {editing ? (
        <div style={{ marginBottom: '16px' }}>
          <input style={{ ...inputStyle, marginBottom: '8px' }} placeholder="Name"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input style={{ ...inputStyle, marginBottom: '8px' }} placeholder="Department"
            value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <textarea style={{ ...inputStyle, resize: 'none', marginBottom: '8px' }}
            placeholder="Short bio..." value={form.bio} rows={2}
            onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '8px', backgroundColor: '#2563eb', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 500
            }}>
              <FiCheck size={13} /> Save
            </button>
            <button onClick={() => setEditing(false)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '8px', backgroundColor: '#f1f5f9', color: '#64748b',
              border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 500
            }}>
              <FiX size={13} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 style={{ fontWeight: 700, color: '#0f172a', textAlign: 'center', fontSize: '16px', marginBottom: '2px' }}>
            {userInfo.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '2px' }}>
            {userInfo.email}
          </p>
          <p style={{ fontSize: '12px', color: '#3b82f6', textAlign: 'center', fontWeight: 500, marginBottom: '8px' }}>
            {userInfo.department || 'Student'}
          </p>
          {userInfo.bio && (
            <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginBottom: '12px', lineHeight: 1.5 }}>
              {userInfo.bio}
            </p>
          )}
          <button onClick={() => setEditing(true)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', padding: '8px', fontSize: '13px', color: '#64748b',
            border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: 'transparent',
            cursor: 'pointer', marginBottom: '16px', fontWeight: 500
          }}>
            <FiEdit3 size={13} /> Edit Profile
          </button>
        </>
      )}

      {/* Stats */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', fontWeight: 700, color: '#2563eb' }}>{userIssues.length}</p>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Issues Posted</p>
        </div>
        <div style={{ backgroundColor: '#f5f3ff', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', fontWeight: 700, color: '#7c3aed' }}>{totalUpvotes}</p>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Upvotes Received</p>
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar