import { useState } from 'react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"

interface LoginFormProps {
  onLogin?: (email: string, token: string) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
  
    console.log('Iniciando sesión con:', { email, password })
  
    try {
      const formData = new FormData()
      formData.append('username', email)  // Enviar 'email' como 'username'
      formData.append('password', password)
  
      const response = await fetch('https://api.unicornio.tech/token', {
        method: 'POST',
        body: formData,  // Enviar FormData en lugar de JSON
      })
  
      if (!response.ok) {
        const data = await response.json()
        setErrorMessage(data.detail || 'Error al iniciar sesión')
        return
      }
  
      const data = await response.json()
  
      // Guardar token y país en el localStorage
      const token = data.access_token
      const decodedToken = JSON.parse(atob(token.split('.')[1])) // Decodificar el token JWT
      const pais = decodedToken.pais  // Obtener el país del token
  
      console.log('Login exitoso:', data)
      console.log('País del embajador:', pais)
  
      // Guardar el token y el país en el localStorage
      localStorage.setItem('access_token', token)
      localStorage.setItem('pais', pais)
  
      if (onLogin) {
        onLogin(token, pais)
      }
    } catch (error) {
      console.error('Error en la solicitud de login:', error)
      setErrorMessage('Error al conectar con el servidor')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none text-gray-700">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              </div>
              <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none text-gray-700">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              </div>
            </div>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <CardFooter className="flex justify-center mt-6">
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}