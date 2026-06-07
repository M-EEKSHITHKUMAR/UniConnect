import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import {
  FiHome, FiTrendingUp, FiUsers, FiLogOut,
  FiMenu, FiX, FiUser
} from 'react-icons/fi'
import { MdOutlineSchool } from 'react-icons/md'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { userInfo } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: <FiHome /> },
    { path: '/trending', label: 'Trending', icon: <FiTrendingUp /> },
    { path: '/clubs', label: 'Clubs', icon: <FiUsers /> },
    { path: '/alumni', label: 'Alumni', icon: <MdOutlineSchool /> },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: 'white', borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>U</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
              Uni<span style={{ color: '#3b82f6' }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                  backgroundColor: isActive(link.path) ? '#eff6ff' : 'transparent',
                  color: isActive(link.path) ? '#2563eb' : '#64748b',
                  transition: 'all 0.2s',
                }}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
            {userInfo ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '34px', height: '34px',
                    background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                      {userInfo.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>{userInfo.name}</span>
                  {userInfo.email === 'admin@gmail.com' && (
                    <span style={{
                      fontSize: '11px', backgroundColor: '#fee2e2', color: '#dc2626',
                      padding: '2px 8px', borderRadius: '20px', fontWeight: 600
                    }}>Admin</span>
                  )}
                </div>
                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '10px', border: 'none',
                  backgroundColor: 'transparent', color: '#64748b',
                  fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', backgroundColor: '#2563eb',
                color: 'white', borderRadius: '10px', fontSize: '14px',
                fontWeight: 500, textDecoration: 'none'
              }}>
                <FiUser /> Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', padding: '8px', borderRadius: '8px',
              border: 'none', backgroundColor: 'transparent',
              color: '#64748b', cursor: 'pointer'
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          backgroundColor: 'white', borderTop: '1px solid #e2e8f0',
          padding: '12px 16px'
        }} className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px',
                fontSize: '14px', fontWeight: 500, textDecoration: 'none', marginBottom: '4px',
                backgroundColor: isActive(link.path) ? '#eff6ff' : 'transparent',
                color: isActive(link.path) ? '#2563eb' : '#64748b',
              }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          {userInfo && (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '10px', border: 'none',
                backgroundColor: 'transparent', color: '#ef4444',
                fontSize: '14px', fontWeight: 500, cursor: 'pointer'
              }}
            >
              <FiLogOut /> Logout
            </button>
          )}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar