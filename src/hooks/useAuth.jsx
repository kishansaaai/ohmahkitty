import { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerk()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (isLoaded && clerkUser) {
      // Load profile from localStorage or create default
      const storedProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}')
      const userProfile = storedProfiles[clerkUser.id] || {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'Volunteer',
        email: clerkUser.primaryEmailAddress?.emailAddress,
        role: 'volunteer'
      }
      
      // Save profile if new
      if (!storedProfiles[clerkUser.id]) {
        storedProfiles[clerkUser.id] = userProfile
        localStorage.setItem('userProfiles', JSON.stringify(storedProfiles))
      }
      
      setProfile(userProfile)
    } else if (isLoaded) {
      setProfile(null)
    }
  }, [clerkUser, isLoaded])

  const signOut = async () => {
    setProfile(null)
    await clerkSignOut()
  }

  const isAdmin = profile?.role === 'admin'
  const isFeeder = profile?.role === 'feeder'

  return (
    <AuthContext.Provider value={{ 
      user: clerkUser, 
      profile, 
      loading: !isLoaded, 
      isAdmin, 
      isFeeder, 
      signOut,
      refetchProfile: () => {
        if (clerkUser) {
          const storedProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}')
          setProfile(storedProfiles[clerkUser.id] || null)
        }
      }
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
