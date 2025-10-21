import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const DebugUser = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <div className="text-white">No user logged in</div>
  }

  return (
    <div className="bg-red-500/20 p-4 rounded-lg text-white text-sm">
      <h3 className="font-bold mb-2">Debug User Info:</h3>
      <div className="space-y-1">
        <div><strong>Email:</strong> {currentUser.email}</div>
        <div><strong>Display Name:</strong> {currentUser.displayName || 'None'}</div>
        <div><strong>Photo URL:</strong> {currentUser.photoURL || 'None'}</div>
        <div><strong>UID:</strong> {currentUser.uid}</div>
        <div><strong>Creation Time:</strong> {currentUser.metadata?.creationTime || 'None'}</div>
        <div><strong>Last Sign In:</strong> {currentUser.metadata?.lastSignInTime || 'None'}</div>
      </div>
      
      {currentUser.photoURL && (
        <div className="mt-4">
          <div className="font-bold mb-2">Avatar Test:</div>
          <img 
            src={currentUser.photoURL} 
            alt="User Avatar" 
            className="w-16 h-16 rounded-full object-cover border-2 border-white"
            onLoad={() => console.log('Avatar loaded successfully')}
            onError={(e) => console.error('Avatar failed to load:', e)}
          />
        </div>
      )}
      
      <div className="mt-4">
        <div className="font-bold mb-2">Default Avatar Test:</div>
        <div className="flex gap-4">
          <div>
            <div className="text-xs mb-1">Default Avatar:</div>
            <img 
              src="/Default.jpeg" 
              alt="Default Avatar Test" 
              className="w-12 h-12 rounded-full object-cover border border-white"
              onLoad={() => console.log('Default avatar loaded successfully')}
              onError={(e) => console.error('Default avatar failed to load:', e)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugUser
