import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const SignUp = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [displayName, setDisplayName] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const { signup, signInWithGoogle, error, clearError } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSignUp = async (e) => {
    e.preventDefault()
    
    if (!email || !password || !confirm) {
      return
    }
    if (!validateEmail(email)) {
      return
    }
    if (password !== confirm) {
      return
    }
    if (password.length < 6) {
      return
    }

    try {
      setLoading(true)
      clearError()
      await signup(email, password, displayName)
      navigate('/dashboard')
    } catch (error) {
      console.error('Sign up error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true)
      clearError()
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      console.error('Google sign up error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden w-full rounded-xl">
      <div className="morph-bg" aria-hidden="true">
        <div className="morph-blob" />
        <div className="morph-blob" />
        <div className="morph-blob" />
      </div>
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#121212] backdrop-blur-sm  shadow-2xl p-8 flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-6 shadow-lg">
          <span className="text-white text-lg">NZ</span>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Create your account
        </h2>
        
        <form onSubmit={handleSignUp} className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Full Name (Optional)"
              type="text"
              value={displayName}
              className="w-full px-5 py-3 rounded-xl  bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              required
              className="w-full px-5 py-3 rounded-xl  bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password (min 6 characters)"
              type="password"
              value={password}
              required
              minLength={6}
              className="w-full px-5 py-3 rounded-xl  bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirm}
              required
              className="w-full px-5 py-3 rounded-xl  bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setConfirm(e.target.value)}
            />
            {error && (
              <div className="text-sm text-red-400 text-left">{error}</div>
            )}
          </div>
          <hr className="opacity-10" />
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition mb-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign up'}
            </button>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              {loading ? 'Signing up...' : 'Continue with Google'}
            </button>
            <div className="w-full text-center mt-2">
              <span className="text-xs text-gray-400">
                Already have an account?{' '}
                <Link to="/signin" className="underline text-white/80 hover:text-white">
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
