// TNR Tracker - Secure Gemini Proxy Edge Function
// Prevents API key exposure and implements rate limiting

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS configuration - UPDATE THIS FOR PRODUCTION
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://tnr-tracker.vercel.app',
  // Add your production domain here
]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Will be overridden per request
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory rate limiting (per-instance)
// Note: In production, use Redis or database for distributed rate limiting
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60000 // 60 seconds

// Security: Validate and sanitize origin
function validateOrigin(origin: string | null): string {
  if (!origin) return ALLOWED_ORIGINS[0]
  
  const isAllowed = ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))
  return isAllowed ? origin : ALLOWED_ORIGINS[0]
}

// Rate limiting check
function checkRateLimit(userId: string): { allowed: boolean; message?: string } {
  const now = Date.now()
  const lastRequest = rateLimitMap.get(userId)

  if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW) {
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - lastRequest)) / 1000)
    return {
      allowed: false,
      message: `Rate limit exceeded. Please wait ${waitTime} seconds.`
    }
  }

  rateLimitMap.set(userId, now)
  return { allowed: true }
}

// Clean up old rate limit entries (run periodically)
function cleanupRateLimits() {
  const now = Date.now()
  for (const [userId, timestamp] of rateLimitMap.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(userId)
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000)

serve(async (req) => {
  const origin = req.headers.get('origin')
  const validOrigin = validateOrigin(origin)
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': validOrigin,
      },
    })
  }

  try {
    // 1. Authentication: Verify JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authorization header' }),
        { 
          status: 401,
          headers: { 
            ...corsHeaders, 
            'Access-Control-Allow-Origin': validOrigin,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { 
          status: 403,
          headers: { 
            ...corsHeaders, 
            'Access-Control-Allow-Origin': validOrigin,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // 2. Rate Limiting
    const rateLimitCheck = checkRateLimit(user.id)
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ error: rateLimitCheck.message }),
        { 
          status: 429,
          headers: { 
            ...corsHeaders, 
            'Access-Control-Allow-Origin': validOrigin,
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      )
    }

    // 3. Parse and validate request body
    const body = await req.json()
    
    if (!body.image) {
      return new Response(
        JSON.stringify({ error: 'Bad Request: Missing image data' }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Access-Control-Allow-Origin': validOrigin,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Security: Validate base64 image format
    const base64Pattern = /^data:image\/(jpeg|jpg|png|webp);base64,/
    if (!base64Pattern.test(body.image)) {
      return new Response(
        JSON.stringify({ error: 'Invalid image format. Only JPEG, PNG, and WebP allowed.' }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Access-Control-Allow-Origin': validOrigin,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // 4. Call Gemini API with secure key
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash'

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Access-Control-Allow-Origin': validOrigin,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Extract base64 data
    const base64Data = body.image.split(',')[1]

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Analyze this cat photo and provide:
1. Breed or coat pattern (e.g., "Orange Tabby", "Tuxedo", "Calico")
2. Does the cat have an ear-tip? (YES/NO) - An ear-tip is when the tip of the left or right ear is surgically removed as a TNR marker
3. Approximate age (kitten, young adult, adult, senior)
4. Notable markings or features

Format your response as JSON:
{
  "breed": "breed name",
  "earTip": true/false,
  "age": "age category",
  "notes": "any notable features"
}`
              },
              {
                inline_data: {
                  mime_type: body.image.match(/data:(image\/[a-z]+);/)?.[1] || 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 500,
          }
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'AI analysis failed', details: errorText }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Access-Control-Allow-Origin': validOrigin,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const geminiData = await geminiResponse.json()

    // 5. Log API usage to database (optional - for monitoring)
    try {
      await supabase
        .from('api_rate_limits')
        .upsert({
          user_id: user.id,
          endpoint: 'gemini-proxy',
          last_request: new Date().toISOString(),
          request_count: 1
        }, {
          onConflict: 'user_id,endpoint',
          ignoreDuplicates: false
        })
    } catch (dbError) {
      console.error('Failed to log API usage:', dbError)
      // Don't fail the request if logging fails
    }

    // 6. Return successful response
    return new Response(
      JSON.stringify(geminiData),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Access-Control-Allow-Origin': validOrigin,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('Edge Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Access-Control-Allow-Origin': validOrigin,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})
