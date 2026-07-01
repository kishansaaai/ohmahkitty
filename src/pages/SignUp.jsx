import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignUp } from '@clerk/clerk-react'
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

export default function SignUpPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

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
          <div className="flex flex-col items-center text-center mb-6">
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

          {/* Clerk Authentication Component */}
          <div className="flex justify-center">
            <SignUp 
              routing="hash"
              signInUrl="#/auth"
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none bg-transparent",
                  formButtonPrimary: "bg-gradient-to-r from-amber-500 to-coral-500 hover:opacity-90",
                }
              }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
