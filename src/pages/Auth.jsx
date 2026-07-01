import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react"
import toast from 'react-hot-toast'

import { useAuth } from '../hooks/useAuth.jsx'
import catSleeping from '../assets/cat-sleeping.png'

function PawIcon({ className, style, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={style}
      {...props}
    >
      <ellipse cx="6" cy="9" rx="1.7" ry="2.3" />
      <ellipse cx="10" cy="6" rx="1.7" ry="2.3" />
      <ellipse cx="14" cy="6" rx="1.7" ry="2.3" />
      <ellipse cx="18" cy="9" rx="1.7" ry="2.3" />
      <path d="M12 11.5c-3.2 0-5.8 2.4-5.8 5 0 1.9 1.5 3 3.5 3 1.1 0 1.6-.5 2.3-.5s1.2.5 2.3.5c2 0 3.5-1.1 3.5-3 0-2.6-2.6-5-5.8-5z" />
    </svg>
  )
}

function Field({ id, label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden
        >
          {icon}
        </span>
        {children}
      </div>
    </div>
  )
}

export default function Auth() {
  const navigate = useNavigate()
  const { user, signIn, signUp, signInWithGoogle, signInWithGitHub } = useAuth()

  const [mode, setMode] = useState("signin")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const handleOAuthSignIn = async (provider) => {
    try {
      setSubmitting(true)
      if (provider === 'google') {
        await signInWithGoogle()
      } else if (provider === 'github') {
        await signInWithGitHub()
      }
    } catch (err) {
      toast.error(err.message || 'OAuth sign-in failed')
      setSubmitting(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      if (mode === "signin") {
        await signIn(email, password)
        toast.success("Welcome back!")
      } else {
        if (!fullName.trim()) throw new Error("Please enter your name.")
        await signUp(email, password, fullName.trim())
        toast.success("Account created — welcome to TNR Tracker!")
      }
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err.message || "Something went wrong"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden section-mint px-4 py-12"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--amber)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--forest)" }}
      />
      <img
        src={catSleeping}
        alt=""
        aria-hidden
        width={180}
        height={180}
        loading="lazy"
        className="pointer-events-none absolute -top-6 right-8 hidden h-44 w-44 rotate-6 drop-shadow-2xl md:block lg:right-24 animate-float-y"
      />
      <PawIcon
        aria-hidden
        className="pointer-events-none absolute bottom-12 left-10 hidden h-12 w-12 opacity-40 md:block animate-float-y"
        style={{ color: "var(--sage)" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Whimsical cat ears perched on top of the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-5 left-1/2 z-20 flex w-48 -translate-x-1/2 justify-between px-2"
        >
          <div
            className="h-12 w-12 rotate-12 rounded-tl-lg rounded-tr-3xl border-l-4 border-t-4 shadow-sm"
            style={{
              background: "white",
              borderColor: "var(--sage)",
            }}
          />
          <div
            className="h-12 w-12 -rotate-12 rounded-tl-3xl rounded-tr-lg border-r-4 border-t-4 shadow-sm"
            style={{
              background: "white",
              borderColor: "var(--sage)",
            }}
          />
        </div>

        {/* Peeking cat tucked behind the card's bottom-right */}
        <svg
          aria-hidden
          viewBox="0 0 120 100"
          className="pointer-events-none absolute -right-12 -bottom-2 z-0 hidden h-24 w-28 drop-shadow-md lg:block animate-float-y"
        >
          <path d="M20 100C20 70 40 50 60 50C80 50 100 70 100 100" fill="white" />
          <path d="M20 50L35 65" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <path d="M100 50L85 65" stroke="white" strokeWidth="8" strokeLinecap="round" />
          <circle cx="45" cy="75" r="4" fill="var(--forest)" />
          <circle cx="75" cy="75" r="4" fill="var(--forest)" />
          <path
            d="M55 85C55 85 60 88 65 85"
            stroke="var(--coral)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <section
          className="relative z-10 w-full rounded-3xl p-8 sm:p-10 glass-strong lift-on-hover overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.88)",
            boxShadow: "var(--shadow-card)",
            borderColor: "rgba(45, 106, 79, 0.14)",
          }}
        >
          {/* Soft paw watermark inside the card */}
          <PawIcon
            aria-hidden
            className="pointer-events-none absolute right-6 top-6 h-16 w-16 rotate-12 opacity-15"
            style={{ color: "var(--mint)" }}
          />
          <PawIcon
            aria-hidden
            className="pointer-events-none absolute -left-3 bottom-10 h-10 w-10 -rotate-12 opacity-10"
            style={{ color: "var(--sage)" }}
          />
          {/* Brand */}
          <div className="flex flex-col items-center text-center">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, var(--amber), var(--coral))",
                boxShadow: "var(--shadow-glow-amber)",
              }}
            >
              <PawIcon className="h-7 w-7" />
            </span>
            <h1
              className="mt-4 text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--forest)" }}
            >
              TNR Tracker
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Coordinating care for community cats
            </p>
          </div>

          {/* Mode toggle */}
          <div
            role="tablist"
            aria-label="Authentication mode"
            className="mt-7 grid grid-cols-2 gap-1 rounded-full p-1"
            style={{
              background: "var(--mint)",
              border: "1px solid rgba(45, 106, 79, 0.14)",
            }}
          >
            {["signin", "signup"].map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(m)}
                  className={`h-9 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? "text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, var(--forest), var(--sage))",
                          boxShadow: "0 6px 14px -6px rgba(45,106,79,0.45)",
                        }
                      : undefined
                  }
                >
                  {m === "signin" ? "Sign in" : "Sign up"}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field
                id="name"
                label="Your name"
                icon={<UserIcon className="h-4 w-4" />}
              >
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="glass w-full h-12 rounded-full border border-gray-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                />
              </Field>
            )}

            <Field id="email" label="Email" icon={<Mail className="h-4 w-4" />}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass w-full h-12 rounded-full border border-gray-200 pl-11 pr-4 outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
            </Field>

            <Field id="password" label="Password" icon={<Lock className="h-4 w-4" />}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass w-full h-12 rounded-full border border-gray-200 pl-11 pr-12 outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-400 transition-colors hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 h-12 w-full flex items-center justify-center rounded-full text-base font-semibold text-white border-0 hover:opacity-95 disabled:opacity-80 transition-opacity"
              style={{
                background: "linear-gradient(135deg, var(--amber), var(--coral))",
                boxShadow: "var(--shadow-glow-amber)",
              }}
            >
              {submitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <PawIcon className="mr-2 h-5 w-5" />
              )}
              {mode === "signin"
                ? submitting
                  ? "Signing in…"
                  : "Sign in"
                : submitting
                  ? "Creating account…"
                  : "Create account"}
            </button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 bg-white">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                disabled={submitting}
                className="flex items-center justify-center h-11 rounded-full border-2 border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                disabled={submitting}
                className="flex items-center justify-center h-11 rounded-full border-2 border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "var(--coral)" }}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "var(--forest)" }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </section>
      </div>
    </main>
  )
}
