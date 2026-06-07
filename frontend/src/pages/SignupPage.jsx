import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendOtp, verifyOtp, register, clearError, resetOtpState } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiBookOpen, FiShield, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi'

// ── Step indicator ────────────────────────────────────────────────────────────
const StepBar = ({ step }) => {
  const steps = ['Details', 'Verify Email', 'Done']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '28px' }}>
      {steps.map((label, idx) => {
        const num = idx + 1
        const isActive = step === num
        const isDone = step > num
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700,
                backgroundColor: isDone ? '#22c55e' : isActive ? '#2563eb' : '#e2e8f0',
                color: isDone || isActive ? 'white' : '#94a3b8',
                transition: 'all 0.3s'
              }}>
                {isDone ? '✓' : num}
              </div>
              <span style={{
                fontSize: '11px', marginTop: '4px', fontWeight: 500,
                color: isDone ? '#22c55e' : isActive ? '#2563eb' : '#94a3b8'
              }}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{
                width: '60px', height: '2px', marginBottom: '18px',
                backgroundColor: step > num ? '#22c55e' : '#e2e8f0',
                transition: 'background-color 0.3s'
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── OTP Input boxes ───────────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([])
  const digits = value.split('')

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) return
    const newDigits = [...digits]
    newDigits[idx] = val.slice(-1)
    onChange(newDigits.join(''))
    if (idx < 5 && val) inputsRef.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newDigits = [...digits]
      if (newDigits[idx]) {
        newDigits[idx] = ''
        onChange(newDigits.join(''))
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus()
        newDigits[idx - 1] = ''
        onChange(newDigits.join(''))
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted.padEnd(6, '').slice(0, 6))
    inputsRef.current[Math.min(pasted.length, 5)]?.focus()
  }

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
      {[...Array(6)].map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          style={{
            width: '44px', height: '52px', textAlign: 'center',
            fontSize: '22px', fontWeight: 700,
            border: `2px solid ${digits[idx] ? '#2563eb' : '#e2e8f0'}`,
            borderRadius: '12px', outline: 'none',
            backgroundColor: digits[idx] ? '#eff6ff' : '#f8fafc',
            color: '#0f172a', transition: 'all 0.2s',
            fontFamily: 'Inter, sans-serif'
          }}
        />
      ))}
    </div>
  )
}

// ── Main Signup Page ──────────────────────────────────────────────────────────
const SignupPage = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', bio: '' })
  const [otp, setOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [showPass, setShowPass] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, userInfo, otpLoading, otpError } = useSelector((s) => s.auth)

  useEffect(() => { if (userInfo) navigate('/') }, [userInfo, navigate])

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error, dispatch])

  useEffect(() => {
    if (otpError) { toast.error(otpError); dispatch(clearError()) }
  }, [otpError, dispatch])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((p) => p - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSendOtp = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill name, email and password first')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    try {
      await dispatch(sendOtp(form.email)).unwrap()
      toast.success(`OTP sent to ${form.email}`)
      setStep(2)
      setResendTimer(60)
    } catch (err) {
      toast.error(err || 'Failed to send OTP')
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP')
      return
    }
    try {
      await dispatch(verifyOtp({ email: form.email, otp })).unwrap()
      toast.success('Email verified!')
      setStep(3)
    } catch (err) {
      toast.error(err || 'Invalid OTP')
      setOtp('')
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setOtp('')
    try {
      await dispatch(sendOtp(form.email)).unwrap()
      toast.success('New OTP sent!')
      setResendTimer(60)
    } catch (err) {
      toast.error(err || 'Failed to resend OTP')
    }
  }

  const handleRegister = async () => {
    try {
      await dispatch(register(form)).unwrap()
      dispatch(resetOtpState())
      toast.success('Account created successfully!')
    } catch (err) {
      toast.error(err || 'Registration failed')
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 12px 12px 40px',
    border: '1px solid #e2e8f0', borderRadius: '12px',
    fontSize: '14px', outline: 'none',
    fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 50%, #faf5ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 8px 20px rgba(99,102,241,0.3)'
          }}>
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>U</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
            Join UniConnect
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Create your student account</p>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '28px',
          border: '1px solid #f1f5f9'
        }}>
          <StepBar step={step} />

          {/* ── STEP 1: Fill Details ── */}
          {step === 1 && (
            <div>
              {/* Name */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <FiUser size={15} />
                  </span>
                  <input name="name" type="text" value={form.name}
                    onChange={handleChange} placeholder="John Doe" style={inputStyle} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Email *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <FiMail size={15} />
                  </span>
                  <input name="email" type="email" value={form.email}
                    onChange={handleChange} placeholder="you@student.edu" style={inputStyle} />
                </div>
              </div>

              {/* Password with show/hide */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <FiLock size={15} />
                  </span>
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    style={{ ...inputStyle, paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0'
                    }}
                  >
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              {/* Department */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Department
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <FiBookOpen size={15} />
                  </span>
                  <input name="department" type="text" value={form.department}
                    onChange={handleChange} placeholder="Computer Science" style={inputStyle} />
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Bio (optional)
                </label>
                <textarea name="bio" value={form.bio} onChange={handleChange}
                  placeholder="Tell us about yourself..." rows={2}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1px solid #e2e8f0', borderRadius: '12px',
                    fontSize: '14px', outline: 'none', resize: 'none',
                    fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc'
                  }} />
              </div>

              <button onClick={handleSendOtp} disabled={otpLoading} style={{
                width: '100%', padding: '13px',
                background: otpLoading ? '#e2e8f0' : 'linear-gradient(135deg, #2563eb, #6366f1)',
                color: otpLoading ? '#94a3b8' : 'white',
                border: 'none', borderRadius: '12px', fontSize: '15px',
                fontWeight: 600, cursor: otpLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: otpLoading ? 'none' : '0 4px 12px rgba(99,102,241,0.3)'
              }}>
                {otpLoading ? 'Sending OTP...' : '📧 Send Verification OTP'}
              </button>
            </div>
          )}

          {/* ── STEP 2: Verify OTP ── */}
          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px', height: '60px', margin: '0 auto 16px',
                backgroundColor: '#eff6ff', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FiShield size={26} style={{ color: '#2563eb' }} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                Check Your Email
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                We sent a 6-digit OTP to
              </p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
                {form.email}
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                OTP expires in 10 minutes
              </p>

              <OtpInput value={otp} onChange={setOtp} />

              <button onClick={handleVerifyOtp} disabled={otpLoading || otp.length !== 6} style={{
                width: '100%', padding: '13px',
                background: (otpLoading || otp.length !== 6)
                  ? '#e2e8f0'
                  : 'linear-gradient(135deg, #2563eb, #6366f1)',
                color: (otpLoading || otp.length !== 6) ? '#94a3b8' : 'white',
                border: 'none', borderRadius: '12px', fontSize: '15px',
                fontWeight: 600, cursor: (otpLoading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif', marginBottom: '14px',
                boxShadow: otp.length === 6 ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
              }}>
                {otpLoading ? 'Verifying...' : '✅ Verify OTP'}
              </button>

              {/* Resend */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <button onClick={handleResend} disabled={resendTimer > 0 || otpLoading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: '13px', color: resendTimer > 0 ? '#94a3b8' : '#2563eb',
                    background: 'none', border: 'none',
                    cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif', fontWeight: 500
                  }}>
                  <FiRefreshCw size={13} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>

              {/* Back */}
              <button onClick={() => { setStep(1); setOtp('') }} style={{
                marginTop: '12px', fontSize: '13px', color: '#64748b',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}>
                ← Back to details
              </button>
            </div>
          )}

          {/* ── STEP 3: Complete Registration ── */}
          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', boxShadow: '0 4px 14px rgba(34,197,94,0.3)'
              }}>
                <span style={{ color: 'white', fontSize: '28px' }}>✓</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                Email Verified!
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
                {form.email} has been verified
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                Click below to complete your registration
              </p>

              {/* Summary card */}
              <div style={{
                backgroundColor: '#f8fafc', borderRadius: '12px',
                padding: '14px 16px', marginBottom: '20px',
                border: '1px solid #e2e8f0', textAlign: 'left'
              }}>
                <p style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                  <strong>Name:</strong> {form.name}
                </p>
                <p style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                  <strong>Email:</strong> {form.email}
                </p>
                {form.department && (
                  <p style={{ fontSize: '13px', color: '#374151' }}>
                    <strong>Department:</strong> {form.department}
                  </p>
                )}
              </div>

              <button onClick={handleRegister} disabled={loading} style={{
                width: '100%', padding: '13px',
                background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: loading ? '#94a3b8' : 'white',
                border: 'none', borderRadius: '12px', fontSize: '15px',
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(34,197,94,0.3)'
              }}>
                {loading ? 'Creating account...' : '🚀 Complete Registration'}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage