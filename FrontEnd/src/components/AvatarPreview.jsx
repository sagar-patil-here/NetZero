import React from 'react'
import { generateAvatar } from '../utils/avatarGenerator'

const AvatarPreview = ({ className = "w-16 h-16" }) => {
  const avatarUrl = generateAvatar()

  return (
    <div className={`${className} rounded-full overflow-hidden bg-white/10 flex items-center justify-center`}>
      <img
        src={avatarUrl}
        alt="Avatar Preview"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to a default avatar if image fails to load
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
      <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-xs" style={{ display: 'none' }}>
        ?
      </div>
    </div>
  )
}

export default AvatarPreview
