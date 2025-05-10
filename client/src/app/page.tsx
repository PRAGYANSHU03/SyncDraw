'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/ThemeProvider'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useSession, signOut, signIn } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const [roomId, setRoomId] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { data: session, status } = useSession()

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8)
    router.push(`/room/${newRoomId}`)
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`)
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
        return
      }

      router.refresh()
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/gradients-wallpaper-collection-2560-x-1440-v0-9ekmndpy9lne1.webp")',
          filter: 'brightness(0.7)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">SyncDraw</h1>
            <div className="flex items-center space-x-4">
              {session && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-foreground hover:text-foreground"
                  >
                    <span className="material-icons">account_circle</span>
                  </Button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-foreground border-b border-border">
                          {session?.user?.name || session?.user?.email}
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                className="text-foreground hover:text-foreground"
              >
                {theme === 'light' ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          {!session ? (
            <div className="max-w-md w-full space-y-8 p-8 bg-card/80 backdrop-blur-sm text-card-foreground rounded-lg shadow-lg border border-border/50">
              <div>
                <h1 className="text-3xl font-bold text-center">
                  Welcome to SyncDraw
                </h1>
                <p className="mt-2 text-center text-muted-foreground">
                  Sign in to get started or skip to continue
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="space-y-4 rounded-md shadow-sm">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    className="w-full"
                  >
                    Skip for now
                  </Button>
                </div>
              </form>
              <div className="text-center">
                <Link
                  href="/register"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-md w-full space-y-8 p-8 bg-card/80 backdrop-blur-sm text-card-foreground rounded-lg shadow-lg border border-border/50">
              <div>
                <h1 className="text-3xl font-bold text-center">
                  SyncDraw
                </h1>
                <p className="mt-2 text-center text-muted-foreground">
                  Real-time Collaborative Whiteboard
                </p>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={handleCreateRoom}
                  className="w-full"
                >
                  Create New Room
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card/80 text-muted-foreground">
                      Or join existing room
                    </span>
                  </div>
                </div>
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div>
                    <label htmlFor="room-id" className="sr-only">
                      Room ID
                    </label>
                    <input
                      id="room-id"
                      name="room-id"
                      type="text"
                      required
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-input bg-background/80 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring sm:text-sm"
                      placeholder="Enter Room ID"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                  >
                    Join Room
                  </Button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 