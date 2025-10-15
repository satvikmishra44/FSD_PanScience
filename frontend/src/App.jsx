import { Route, Routes } from 'react-router'
import './App.css'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './ProtetctedRoute'
import AllTask from './components/Alltask'

const Logout = () => {
  localStorage.removeItem("taskToken");
}

function App() {
  const backendUrl = "http://localhost:3000"
  return (
    <Routes>
      <Route path='*' element={<Landing />} />
      <Route path='/login' element={<Login backendUrl={backendUrl}/>} />
      <Route path='/register' element={<Register backendUrl={backendUrl}/>} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard backendUrl={backendUrl} /> </ProtectedRoute>} />
      <Route path='/logout' element={<ProtectedRoute><Logout /></ProtectedRoute>} />
      <Route path='/tasks' element={<ProtectedRoute><AllTask backendUrl={backendUrl}/></ProtectedRoute>} />
    </Routes>
  )
}

export default App
