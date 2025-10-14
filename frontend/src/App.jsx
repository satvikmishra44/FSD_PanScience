import { Route, Routes } from 'react-router'
import './App.css'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './ProtetctedRoute'

const Logout = () => {
  localStorage.removeItem("taskToken");
}

function App() {
  const backendUrl = "http://localhost:3000"
  return (
    <Routes>
      <Route path='*' element={<Landing />} />
      <Route path='/login' element={<Login backendUrl={backendUrl}/>} />
      <Route path='/register' element={<ProtectedRoute><Register backendUrl={backendUrl}/> </ProtectedRoute>} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /> </ProtectedRoute>} />
      <Route path='/logout' element={<ProtectedRoute><Logout /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
