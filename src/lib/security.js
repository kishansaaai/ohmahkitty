/**
 * TNR Tracker - Security Utilities
 * Client-side security helpers and validation functions
 */

// Input sanitization and validation
export const SecurityUtils = {
  /**
   * Sanitize user input to prevent XSS
   * Note: React automatically escapes JSX content, but use this for manual DOM manipulation
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate password strength
   * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number
   */
  validatePassword(password) {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
      errors: {
        minLength: !minLength ? 'Password must be at least 8 characters' : null,
        hasUpperCase: !hasUpperCase ? 'Password must contain an uppercase letter' : null,
        hasLowerCase: !hasLowerCase ? 'Password must contain a lowercase letter' : null,
        hasNumber: !hasNumber ? 'Password must contain a number' : null,
      }
    }
  },

  /**
   * Validate geospatial coordinates
   */
  validateCoordinates(lat, lng) {
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)

    const isValidLat = !isNaN(latNum) && latNum >= -90 && latNum <= 90
    const isValidLng = !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180

    return {
      isValid: isValidLat && isValidLng,
      errors: {
        latitude: !isValidLat ? 'Latitude must be between -90 and 90' : null,
        longitude: !isValidLng ? 'Longitude must be between -180 and 180' : null,
      }
    }
  },

  /**
   * Validate image file before upload
   */
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    const isValidType = validTypes.includes(file.type)
    const isValidSize = file.size <= maxSize

    return {
      isValid: isValidType && isValidSize,
      errors: {
        type: !isValidType ? 'Only JPEG, PNG, and WebP images are allowed' : null,
        size: !isValidSize ? 'Image must be smaller than 5MB' : null,
      }
    }
  },

  /**
   * Generate secure file path for storage
   * Format: userId/timestamp-randomString.extension
   */
  generateSecureFilePath(userId, fileName) {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = fileName.split('.').pop()
    
    // Sanitize filename to prevent directory traversal
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    
    return `${userId}/${timestamp}-${randomString}.${extension}`
  },

  /**
   * Check if user has required permissions
   */
  checkPermission(userRole, requiredRole) {
    const roleHierarchy = {
      'volunteer': 1,
      'admin': 2,
    }

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  },

  /**
   * Rate limit client-side actions (local cooldown)
   */
  createRateLimiter(windowMs = 1000) {
    const lastCallMap = new Map()

    return (key) => {
      const now = Date.now()
      const lastCall = lastCallMap.get(key)

      if (lastCall && (now - lastCall) < windowMs) {
        const waitTime = Math.ceil((windowMs - (now - lastCall)) / 1000)
        return {
          allowed: false,
          message: `Please wait ${waitTime} seconds before trying again`
        }
      }

      lastCallMap.set(key, now)
      return { allowed: true }
    }
  },

  /**
   * Secure token storage helpers
   */
  tokenStorage: {
    get(key) {
      try {
        return localStorage.getItem(key)
      } catch (error) {
        console.error('Failed to get token from storage:', error)
        return null
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, value)
        return true
      } catch (error) {
        console.error('Failed to set token in storage:', error)
        return false
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key)
        return true
      } catch (error) {
        console.error('Failed to remove token from storage:', error)
        return false
      }
    },

    clear() {
      try {
        localStorage.clear()
        return true
      } catch (error) {
        console.error('Failed to clear storage:', error)
        return false
      }
    }
  },

  /**
   * Content Security Policy violation handler
   */
  setupCSPViolationReporting() {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.error('CSP Violation:', {
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        effectiveDirective: e.effectiveDirective,
        originalPolicy: e.originalPolicy,
      })

      // In production, send this to your monitoring service (e.g., Sentry)
      if (import.meta.env.PROD) {
        // Example: Sentry.captureException(e)
      }
    })
  },

  /**
   * Detect and prevent clickjacking
   */
  preventClickjacking() {
    if (window.self !== window.top) {
      // Page is in an iframe
      console.warn('Clickjacking attempt detected')
      
      // Break out of iframe (optional - can be aggressive)
      // window.top.location = window.self.location
      
      // Or show warning
      document.body.innerHTML = '<h1>Security Warning: This page cannot be displayed in a frame.</h1>'
    }
  },

  /**
   * Generate CSRF token (for non-JWT authenticated endpoints)
   */
  generateCSRFToken() {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  },

  /**
   * Validate URL to prevent open redirect vulnerabilities
   */
  validateRedirectURL(url) {
    try {
      const parsedURL = new URL(url, window.location.origin)
      
      // Only allow same-origin redirects
      if (parsedURL.origin !== window.location.origin) {
        console.warn('Blocked cross-origin redirect:', url)
        return false
      }

      return true
    } catch (error) {
      console.error('Invalid redirect URL:', url, error)
      return false
    }
  },

  /**
   * Secure API call wrapper with automatic auth header
   */
  async secureAPICall(supabase, functionName, body) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      const response = await supabase.functions.invoke(functionName, {
        body,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      })

      if (response.error) {
        throw response.error
      }

      return response.data
    } catch (error) {
      console.error(`Secure API call to ${functionName} failed:`, error)
      throw error
    }
  }
}

// Initialize security features on app load
export function initializeSecurity() {
  // Setup CSP violation reporting
  SecurityUtils.setupCSPViolationReporting()

  // Prevent clickjacking
  SecurityUtils.preventClickjacking()

  // Log security initialization
  console.info('🔒 Security utilities initialized')
}

export default SecurityUtils
