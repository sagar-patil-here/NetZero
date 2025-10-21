import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from '../Firebase'
import { generateAvatar } from '../utils/avatarGenerator'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Google Auth Provider
  const googleProvider = new GoogleAuthProvider()

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError('')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Always use the default avatar
      const avatarUrl = generateAvatar()
      
      // Update the user's profile with display name and avatar
      const profileUpdates = {
        photoURL: avatarUrl
      }
      if (displayName) {
        profileUpdates.displayName = displayName
      }
      
      try {
        await updateProfile(result.user, profileUpdates)
        console.log('Profile updated successfully with default avatar:', avatarUrl)
      } catch (profileError) {
        console.error('Profile update failed, but user created:', profileError)
        // User is created, profile update failed - this is not critical
      }
      
      return result
    } catch (error) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError('')
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError('')
      const result = await signInWithPopup(auth, googleProvider)
      
      // Always ensure user has the default avatar
      if (result.user) {
        if (!result.user.photoURL) {
          console.log('Google user has no photoURL, assigning default avatar...')
          try {
            const avatarUrl = generateAvatar()
            await updateProfile(result.user, { photoURL: avatarUrl })
            console.log('Google user profile updated with default avatar')
          } catch (profileError) {
            console.error('Failed to update Google user profile:', profileError)
            // Continue anyway - user is signed in
          }
        } else {
          console.log('Google user already has photoURL:', result.user.photoURL)
        }
      }
      
      return result
    } catch (error) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  // Sign out
  const logout = async () => {
    try {
      setError('')
      return await signOut(auth)
    } catch (error) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  // Clear error
  const clearError = () => setError('')

  // Force assign default avatar to current user
  const assignAvatar = async () => {
    if (!currentUser) {
      console.log('No current user to assign avatar to')
      return
    }
    
    try {
      setError('')
      const avatarUrl = generateAvatar()
      console.log('Assigning default avatar to user:', avatarUrl)
      
      try {
        await updateProfile(currentUser, { photoURL: avatarUrl })
        console.log('Default avatar assigned successfully')
        setCurrentUser({ ...currentUser, photoURL: avatarUrl })
      } catch (profileError) {
        console.error('Profile update failed, but updating local state:', profileError)
        // Update local state anyway so user sees the avatar
        setCurrentUser({ ...currentUser, photoURL: avatarUrl })
      }
    } catch (error) {
      console.error('Error in assignAvatar:', error)
      // Try with default avatar as last resort
      const fallbackAvatar = generateAvatar()
      setCurrentUser({ ...currentUser, photoURL: fallbackAvatar })
    }
  }

  // Get user-friendly error messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or sign in.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/user-not-found':
        return 'No account found with this email address.'
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.'
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled. Please try again.'
      default:
        return 'An error occurred. Please try again.'
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user)
      
      if (user) {
        // Always ensure user has the default avatar - assign one if missing
        if (!user.photoURL) {
          console.log('User has no photoURL, assigning default avatar...')
          try {
            const avatarUrl = generateAvatar()
            console.log('Generated avatar URL:', avatarUrl)
            await updateProfile(user, { photoURL: avatarUrl })
            console.log('Profile updated with default avatar')
            // Update the current user state with the new photoURL
            setCurrentUser({ ...user, photoURL: avatarUrl })
          } catch (error) {
            console.error('Error updating profile with avatar:', error)
            // Even if update fails, assign the default avatar to the state
            const fallbackAvatar = generateAvatar()
            setCurrentUser({ ...user, photoURL: fallbackAvatar })
          }
        } else {
          console.log('User already has photoURL:', user.photoURL)
          setCurrentUser(user)
        }
      } else {
        setCurrentUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    assignAvatar,
    error,
    clearError,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
