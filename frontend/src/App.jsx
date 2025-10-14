import { Route, Routes } from 'react-router'
import './App.css'
import Landing from './components/Landing'
import Login from './components/Login'

function App() {
  const backendUrl = "http://localhost:3000"
  return (
    <Routes>
      <Route path='*' element={<Landing />} />
      <Route path='/login' element={<Login backendUrl={backendUrl}/>} />
    </Routes>
  )
}

export default App
