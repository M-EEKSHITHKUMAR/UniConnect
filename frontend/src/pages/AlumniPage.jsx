import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAlumni, createAlumni } from '../features/alumni/alumniSlice'
import { FiMail, FiPhone, FiBriefcase, FiPlus, FiX } from 'react-icons/fi'
import { MdOutlineSchool } from 'react-icons/md'
import toast from 'react-hot-toast'

const gradients = [
  'linear-gradient(135deg, #60a5fa, #2563eb)',
  'linear-gradient(135deg, #a78bfa, #7c3aed)',
  'linear-gradient(135deg, #34d399, #059669)',
  'linear-gradient(135deg, #fb923c, #ea580c)',
  'linear-gradient(135deg, #f472b6, #db2777)',
  'linear-gradient(135deg, #2dd4bf, #0d9488)',
]

const AlumniPage = () => {
  const dispatch = useDispatch()
  const { alumni, loading } = useSelector((state) => state.alumni)
  const {userInfo}=useSelector((state)=>state.auth);
  const isAdmin=(userInfo?.email==='admin@gmail.com');
  const [showForm,setShowForm]=useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    graduationYear: '',
    currentRole: '',
    company: '',
    department: '',
  })

  const handleCreateAlumni = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAlumni(formData)).unwrap()

      toast.success('Alumni added successfully')

      setFormData({
        name: '',
        email: '',
        phone: '',
        graduationYear: '',
        currentRole: '',
        company: '',
        department: '',
      })

      setShowForm(false)
    } catch (err) {
      toast.error(err || 'Failed to create Alumni')
    }
  }

  useEffect(() => { dispatch(fetchAlumni()) }, [dispatch])

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '88px 16px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{
          width: '44px', height: '44px', backgroundColor: '#f0fdf4',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <MdOutlineSchool style={{ color: '#16a34a' }} size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Alumni Network</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Connect with our distinguished alumni</p>
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
            {showForm ? 'Close' : 'Add Alumni'}
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
      Add Alumni
    </h3>

    <form
      onSubmit={handleCreateAlumni}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <input
  required
  placeholder="Alumni Name"
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

<input
  required
  type="email"
  placeholder="Email"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
  style={{
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  }}
/>

<input
  required
  placeholder="Phone Number"
  value={formData.phone}
  onChange={(e) =>
    setFormData({ ...formData, phone: e.target.value })
  }
  style={{
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  }}
/>

<input
  required
  type="number"
  placeholder="Graduation Year"
  value={formData.graduationYear}
  onChange={(e) =>
    setFormData({
      ...formData,
      graduationYear: e.target.value,
    })
  }
  style={{
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  }}
/>

<input
  placeholder="Department"
  value={formData.department}
  onChange={(e) =>
    setFormData({
      ...formData,
      department: e.target.value,
    })
  }
  style={{
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  }}
/>

<input
  placeholder="Current Role"
  value={formData.currentRole}
  onChange={(e) =>
    setFormData({
      ...formData,
      currentRole: e.target.value,
    })
  }
  style={{
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  }}
/>

<input
  placeholder="Company"
  value={formData.company}
  onChange={(e) =>
    setFormData({
      ...formData,
      company: e.target.value,
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
  Add Alumni
</button>
    </form>
  </div>
)}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              backgroundColor: 'white', borderRadius: '16px', padding: '24px',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: '#f1f5f9', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '14px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '66%', marginBottom: '6px' }} />
                  <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '50%' }} />
                </div>
              </div>
              <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '6px' }} />
              <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '75%' }} />
            </div>
          ))}
        </div>
      ) : alumni.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
          padding: '48px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>No alumni yet</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>Alumni information will appear here</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {alumni.map((al, idx) => (
            <div key={al._id} style={{
              backgroundColor: 'white', borderRadius: '16px',
              border: '1px solid #f1f5f9', padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '56px', height: '56px', flexShrink: 0,
                  background: gradients[idx % gradients.length],
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                }}>
                  <span style={{ color: 'white', fontSize: '22px', fontWeight: 700 }}>
                    {al.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px', marginBottom: '2px' }}>{al.name}</h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{al.department}</p>
                  <span style={{
                    fontSize: '11px', backgroundColor: '#eff6ff', color: '#2563eb',
                    padding: '2px 8px', borderRadius: '20px', fontWeight: 600
                  }}>
                    Class of {al.graduationYear}
                  </span>
                </div>
              </div>

              {(al.currentRole || al.company) && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  backgroundColor: '#f8fafc', borderRadius: '10px',
                  padding: '10px 12px', marginBottom: '16px'
                }}>
                  <FiBriefcase size={14} style={{ color: '#64748b', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    {al.currentRole && <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{al.currentRole}</p>}
                    {al.company && <p style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{al.company}</p>}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href={`mailto:${al.email}`} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontSize: '13px', color: '#64748b', textDecoration: 'none'
                }}>
                  <div style={{
                    width: '28px', height: '28px', backgroundColor: '#eff6ff',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <FiMail size={13} style={{ color: '#3b82f6' }} />
                  </div>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
                    {al.email}
                  </span>
                </a>
                <a href={`tel:${al.phone}`} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontSize: '13px', color: '#64748b', textDecoration: 'none'
                }}>
                  <div style={{
                    width: '28px', height: '28px', backgroundColor: '#f0fdf4',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <FiPhone size={13} style={{ color: '#22c55e' }} />
                  </div>
                  <span style={{ fontSize: '12px' }}>{al.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AlumniPage