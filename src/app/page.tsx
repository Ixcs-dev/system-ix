'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { useToast } from "./components/ui/use-toast"

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (token) {
      // Redirigir al dashboard si el token es válido
      router.push('/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        // Guardar el token en una cookie en el servidor
        document.cookie = `token=${data.token}; path=/; max-age=3600; secure; HttpOnly`
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%203-8-pWUZqzearpjc0vIHUAxQAlWHmALKgF.png"
              alt="Ixcs.dev Logo"
              className="w-12 h-12"
            />
            <CardTitle className="text-2xl font-bold">Ixcs.dev</CardTitle>
          </div>
          <CardTitle className="text-xl">Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
