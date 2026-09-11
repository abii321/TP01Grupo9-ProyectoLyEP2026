import '../css/login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAutorizaciones from '../hooks/useAutorizaciones'
import AutorizacionesService from '../services/autorizacionesServices'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sector, setSector] = useState('')
  const [errores, setErrores] = useState({})
  const { setAdmin } = useAutorizaciones()
  const navigate = useNavigate()
  const validarCampo = (nombre, valor) => {
    let error = ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (nombre === 'email') {
      if (!valor) error = 'El email es obligatorio'
      else if (!emailRegex.test(valor)) error = 'Email inválido'
    }
    if (nombre == 'password') {
      if (!valor) error = 'La contraseña es obligatoria'
      else if (valor.length < 8) error = 'Mínimo 8 caracteres'
      else if (!/[A-Z]/.test(valor)) error = 'Debe tener una mayúscula'
      else if (!/[0-9]/.test(valor)) error = 'Debe tener un número'
    }
    if (nombre == 'sector') {
      if (!valor) error = 'Seleccione un sector'
    }
    setErrores((prev)=>({...prev,[nombre]:error, general:''}))
    return error
  }
  const validar = () => {
    const errorEmail = validarCampo('email', email)
    const errorPassword = validarCampo('password', password)
    const errorSector = validarCampo('sector', sector)
    return !errorEmail && !errorPassword && !errorSector
  }
  const esFormIncompleto = email.trim() === '' || password.trim() === '' || sector.trim() === '' || Boolean(errores.email) || Boolean(errores.password) || Boolean(errores.sector)
  const manejarSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return
    const usuario = AutorizacionesService.login(
      email,
      password,
      sector
    )
    if (!usuario) {
      setErrores({ general: 'Verifique los datos ingresados' })
      return
    }
    localStorage.setItem("role", usuario.sector)
    setAdmin({
      nombre: usuario.nombre,
      email: usuario.email,
      sector: usuario.sector
    })
    navigate('/')
  }
  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={manejarSubmit} >
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => {
          const valor = e.target.value; setEmail(valor); validarCampo('email',valor) }} />
        <p style={{ color: 'red', minHeight: '18px' }}>
          {errores.email || ' '}
        </p>
        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => {
          const valor = e.target.value; setPassword(valor); validarCampo('password',valor) }}/>
        <p style={{ color: 'red', minHeight: '18px' }}>
          {errores.password || ' '}
        </p>
        <label>Sector:</label>
        <select value={sector} onChange={(e) => { 
          const valor = e.target.value; setSector(valor); validarCampo('sector',valor)}}>
          <option value="">Seleccione un sector</option>
          <option value="Soporte">Soporte</option>
          <option value="Gerencia">Gerencia</option>
        </select>
        <p style={{ color: 'red', minHeight: '18px' }}>
          {errores.sector || ' '}
        </p>
        <p style={{ color: 'red', minHeight: '18px' }}> {errores.general || ' '}</p>
        <button type="submit" disabled={esFormIncompleto}>Ingresar</button>
      </form>
    </div>
  )
}
export default Login