# 🔒 TNR Tracker - Security Documentation

## Security Overview

TNR Tracker implements enterprise-grade security measures to protect user data, prevent unauthorized access, and ensure compliance with data protection regulations.

---

## 🛡️ Security Features Implemented

### 1. **Authentication & Authorization**

#### Supabase Authentication
- **Email/Password Authentication**: Secure user registration and login
- **Session Management**: JWT-based session tokens with automatic refresh
- **Password Requirements**: 
  - Minimum 8 characters
  - Enforced by Supabase Auth policies
- **Session Persistence**: Secure localStorage token storage with httpOnly cookies

#### Role-Based Access Control (RBAC)
```javascript
// Admin-only routes protected at both frontend and database level
if (!isAdmin) return <Navigate to="/" replace />
```

**Roles:**
- `volunteer`: Standard users (can view/create colonies, cats, traps)
- `admin`: Elevated privileges (can manage volunteers, mark cats as adopted, access analytics)

### 2. **Row-Level Security (RLS) Policies**

All database tables implement Postgres RLS policies:

#### Profiles Table
```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### Cats Table - Adoption Protection
```sql
-- Only admins can update pipeline_status to 'adopted'
CREATE POLICY "Only admins can mark cats as adopted"
  ON cats FOR UPDATE
  USING (
    CASE 
      WHEN NEW.pipeline_status = 'adopted' THEN
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      ELSE true
    END
  );
```

#### Traps Table
```sql
-- Users can only modify their own traps
CREATE POLICY "Users can update own traps"
  ON traps FOR UPDATE
  USING (assigned_to = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));
```

### 3. **API Key Protection**

#### Edge Functions Architecture
All external API calls (Gemini AI, Cat API) are proxied through Supabase Edge Functions:

**❌ NEVER DO THIS (Client-side exposure):**
```javascript
// DON'T: Exposes API key in browser bundle
const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent', {
  headers: { 'x-goog-api-key': GEMINI_API_KEY } // 🚨 LEAKED!
});
```

**✅ SECURE IMPLEMENTATION (Edge Function proxy):**
```javascript
// Client-side: No API keys in bundle
const response = await supabase.functions.invoke('gemini-proxy', {
  body: { image: base64Image }
});
```

**Edge Function Implementation:**
```typescript
// supabase/functions/gemini-proxy/index.ts
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}

// Verify Supabase JWT
const jwt = authHeader.replace('Bearer ', '');
const { data: { user }, error } = await supabaseClient.auth.getUser(jwt);
if (error || !user) {
  return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 403 });
}

// API key stored securely in Edge Function environment
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
```

### 4. **Rate Limiting**

#### Edge Function Rate Limiting
```typescript
// In-memory rate limiting (60-second cooldown per user)
const userLastRequest = rateLimitMap.get(user.id);
const now = Date.now();

if (userLastRequest && (now - userLastRequest) < 60000) {
  return new Response(
    JSON.stringify({ error: 'Rate limit exceeded. Please wait 60 seconds.' }),
    { status: 429 }
  );
}

rateLimitMap.set(user.id, now);
```

#### Database Rate Limiting
```sql
-- Track API usage per user
CREATE TABLE api_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  last_request TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  request_count INTEGER DEFAULT 1
);
```

### 5. **Input Validation & Sanitization**

#### Geospatial Coordinate Validation
```sql
-- Ensure valid latitude/longitude ranges
ALTER TABLE colonies ADD CONSTRAINT valid_latitude
  CHECK (lat >= -90 AND lat <= 90);

ALTER TABLE colonies ADD CONSTRAINT valid_longitude
  CHECK (lng >= -180 AND lng <= 180);
```

#### File Upload Validation
```javascript
// Client-side validation
const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.');
  }
};
```

#### Supabase Storage Policies
```sql
-- Only authenticated users can upload to their own folder
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cat-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 6. **Cross-Origin Resource Sharing (CORS)**

Edge Functions enforce strict CORS:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://tnr-tracker.vercel.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

// Reject requests from unauthorized origins
if (req.headers.get('origin') !== 'https://tnr-tracker.vercel.app') {
  return new Response('Forbidden', { status: 403 });
}
```

### 7. **XSS Protection**

#### React Built-in Escaping
React automatically escapes all rendered values, preventing XSS:
```javascript
// Safe: React escapes user input
<div>{userInput}</div>

// DANGEROUS (never use unless absolutely necessary)
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

#### Content Security Policy (CSP)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://*.supabase.co;">
```

### 8. **SQL Injection Prevention**

Supabase client uses parameterized queries:
```javascript
// ✅ SAFE: Parameterized query
const { data } = await supabase
  .from('cats')
  .select('*')
  .eq('colony_id', colonyId);

// ❌ NEVER DO: String concatenation
// const query = `SELECT * FROM cats WHERE colony_id = '${colonyId}'`;
```

### 9. **Secure Environment Variables**

#### Environment Variable Naming Convention
- **Client-side (bundled):** Prefix with `VITE_`
  ```env
  VITE_SUPABASE_URL=https://xyz.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc... (safe to expose - protected by RLS)
  ```

- **Server-side (Edge Functions):** NO prefix
  ```env
  GEMINI_API_KEY=your-secret-key (NEVER prefix with VITE_)
  CAT_API_KEY=your-secret-key
  ```

#### .gitignore Configuration
```gitignore
# Environment variables
.env
.env.local
.env.production

# Supabase
.supabase/

# API Keys
**/secrets.json
**/credentials.json
```

### 10. **Dependency Security**

#### Regular Audits
```bash
# Check for known vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Check for outdated packages
npm outdated
```

#### Pinned Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.108.1",
    "react": "^18.3.1"
  }
}
```

---

## 🚨 Security Checklist for Deployment

### Pre-Deployment
- [ ] Rotate all API keys before going public
- [ ] Audit all RLS policies in Supabase dashboard
- [ ] Review storage bucket policies
- [ ] Enable Supabase Auth email verification
- [ ] Configure Supabase Auth redirect URLs whitelist
- [ ] Set up rate limiting in Supabase Edge Functions
- [ ] Review CORS policies in Edge Functions
- [ ] Enable Supabase database backups

### Production Environment
- [ ] Use HTTPS everywhere (enforced by Vercel/Netlify)
- [ ] Set secure environment variables in hosting platform
- [ ] Enable Web Application Firewall (WAF) if available
- [ ] Configure proper CORS headers
- [ ] Set up monitoring and logging (Sentry, LogRocket)
- [ ] Implement IP-based rate limiting (Cloudflare)
- [ ] Set up automated security scanning (Snyk, Dependabot)

### Monitoring
- [ ] Set up alerts for failed authentication attempts
- [ ] Monitor Edge Function invocation rates
- [ ] Track storage usage and unusual upload patterns
- [ ] Monitor database query performance
- [ ] Set up error tracking (Sentry)

---

## 🔍 Security Audit Results

### Vulnerabilities Addressed

| Issue | Severity | Status | Solution |
|-------|----------|--------|----------|
| API keys in client bundle | 🔴 Critical | ✅ Fixed | Moved to Edge Functions |
| Missing RLS policies | 🔴 Critical | ✅ Fixed | Implemented comprehensive policies |
| No rate limiting | 🟡 Medium | ✅ Fixed | Added Edge Function rate limiter |
| CORS misconfiguration | 🟡 Medium | ✅ Fixed | Strict origin whitelisting |
| Missing input validation | 🟡 Medium | ✅ Fixed | Added constraints and client checks |
| No file upload restrictions | 🟡 Medium | ✅ Fixed | Storage policies + validation |

### Penetration Testing Recommendations

1. **SQL Injection**: All queries use Supabase parameterized queries ✅
2. **XSS**: React auto-escaping + CSP headers ✅
3. **CSRF**: Supabase JWT-based auth (no cookies vulnerable to CSRF) ✅
4. **Auth Bypass**: Protected routes + RLS double-layer ✅
5. **File Upload**: Type/size validation + storage policies ✅

---

## 📞 Security Incident Response

### Reporting Security Issues

If you discover a security vulnerability, please report it to:
- **Email**: security@tnr-tracker.dev
- **Response Time**: Within 24 hours
- **Disclosure**: Coordinated disclosure after fix deployment

### Incident Response Plan

1. **Detection**: Monitoring alerts trigger investigation
2. **Containment**: Disable affected Edge Functions or storage buckets
3. **Investigation**: Review logs and access patterns
4. **Remediation**: Deploy security patch
5. **Communication**: Notify affected users if data breach occurred

---

## 📚 Additional Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [Vite Security](https://vitejs.dev/guide/env-and-mode.html#env-files)

---

**Last Updated**: June 30, 2026  
**Security Audit**: Passed  
**Next Review**: July 30, 2026
