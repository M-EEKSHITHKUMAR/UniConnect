import { useEffect, useState } from 'react'
import { fetchClubs, createClub } from '../features/clubs/clubSlice'
import { FiUsers, FiMail, FiPhone, FiPlus, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'


const gradients = [
  'linear-gradient(135deg, #60a5fa, #2563eb)',
  'linear-gradient(135deg, #a78bfa, #7c3aed)',
  'linear-gradient(135deg, #34d399, #059669)',
  'linear-gradient(135deg, #fb923c, #ea580c)',
  'linear-gradient(135deg, #f472b6, #db2777)',
  'linear-gradient(135deg, #2dd4bf, #0d9488)',
  'linear-gradient(135deg, #818cf8, #4f46e5)',
  'linear-gradient(135deg, #f87171, #dc2626)',
]

const ClubsPage = () => {
  const dispatch = useDispatch()
  const { clubs, loading } = useSelector((state) => state.clubs)
  const { userInfo } = useSelector((state) => state.auth)

  const isAdmin = userInfo?.email === 'admin@gmail.com'

  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
  name: '',
  description: '',
  contactEmail: '',
  contactPhone: '',
  })

  const handleCreateClub = async (e) => {
    e.preventDefault()
    if (
    !formData.name.trim() ||
    !formData.description.trim() ||
    !formData.contactEmail.trim() ||
    !formData.contactPhone.trim()
    ) {
    toast.error('Please fill all fields')
    return
    }
    try {
      await dispatch(createClub(formData)).unwrap()

      toast.success('Club created successfully')

      setFormData({
      name: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      })

      setShowForm(false)
    } catch (err) {
      toast.error(err || 'Failed to create club')
    }
  }

  useEffect(() => { dispatch(fetchClubs()) }, [dispatch])

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '88px 16px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{
          width: '44px', height: '44px', backgroundColor: '#f5f3ff',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FiUsers style={{ color: '#7c3aed' }} size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Campus Clubs</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Connect with student organizations</p>
        </div>
        {isAdmin && (
  <button
    onClick={() => setShowForm(!showForm)}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#7c3aed',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '10px 16px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '14px',
    }}
  >
    {showForm ? <FiX size={16} /> : <FiPlus size={16} />}
    {showForm ? 'Close' : 'Add Club'}
  </button>
)}
      </div>
      {isAdmin && showForm && (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #f1f5f9',
      padding: '20px',
      marginBottom: '28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      maxWidth: '520px',
    }}
  >
    <h3
      style={{
        fontSize: '16px',
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: '16px',
      }}
    >
      Create Club
    </h3>

    <form
      onSubmit={handleCreateClub}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <input
        required
        placeholder="Club Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        style={{
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      />

      <textarea
        rows={3}
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
        style={{
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          resize: 'none',
        }}
      />

      <input
        required
        type="email"
        placeholder="Contact Email"
        value={formData.contactEmail}
        onChange={(e) =>
          setFormData({
            ...formData,
            contactEmail: e.target.value,
          })
        }
        style={{
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      />

      <input
        required
        placeholder="Contact Phone"
        value={formData.contactPhone}
        onChange={(e) =>
          setFormData({
            ...formData,
            contactPhone: e.target.value,
          })
        }
        style={{
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      />

      <button
        type="submit"
        style={{
          backgroundColor: '#7c3aed',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          padding: '10px',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Create Club
      </button>
    </form>
  </div>
)}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              backgroundColor: 'white', borderRadius: '16px', padding: '24px',
              border: '1px solid #f1f5f9', animation: 'pulse 2s infinite'
            }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '12px', marginBottom: '16px' }} />
              <div style={{ height: '16px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '66%', marginBottom: '8px' }} />
              <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '100%' }} />
            </div>
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
          padding: '48px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No clubs yet</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>Club information will appear here soon</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {clubs.map((club, idx) => (
            <div key={club._id} style={{
              backgroundColor: 'white', borderRadius: '16px',
              border: '1px solid #f1f5f9', overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ background: gradients[idx % gradients.length], padding: '20px' }}>
                <div style={{
                  width: '44px', height: '44px', backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '12px'
                }}>
                  <FiUsers style={{ color: 'white' }} size={20} />
                </div>
                <h3 style={{ fontWeight: 700, color: 'white', fontSize: '18px' }}>{club.name}</h3>
              </div>
              <div style={{ padding: '20px' }}>
                {club.description && (
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6 }}>
                    {club.description}
                  </p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href={`mailto:${club.contactEmail}`} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s'
                  }}>
                    <div style={{
                      width: '28px', height: '28px', backgroundColor: '#eff6ff',
                      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <FiMail size={13} style={{ color: '#3b82f6' }} />
                    </div>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {club.contactEmail}
                    </span>
                  </a>
                  <a href={`tel:${club.contactPhone}`} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13px', color: '#64748b', textDecoration: 'none'
                  }}>
                    <div style={{
                      width: '28px', height: '28px', backgroundColor: '#f0fdf4',
                      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <FiPhone size={13} style={{ color: '#22c55e' }} />
                    </div>
                    {club.contactPhone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClubsPage