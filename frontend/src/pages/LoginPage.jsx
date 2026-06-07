import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, userInfo } = useSelector((state) => state.auth)

  useEffect(() => { if (userInfo) navigate('/') }, [userInfo, navigate])
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill all fields'); return }
    dispatch(login({ email, password }))
  }

  const inputStyle = {
    width: '100%', padding: '12px 12px 12px 40px',
    border: '1px solid #e2e8f0', borderRadius: '12px',
    fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s', backgroundColor: '#f8fafc'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 50%, #faf5ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.3)'
          }}>
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>U</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Sign in to UniConnect</p>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '32px',
          border: '1px solid #f1f5f9'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@student.edu" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer'
                }}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              opacity: loading ? 0.7 : 1, fontFamily: 'Inter, sans-serif'
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>
          Admin? Use admin@gmail.com
        </p>
      </div>
    </div>
  )
}

export default LoginPage