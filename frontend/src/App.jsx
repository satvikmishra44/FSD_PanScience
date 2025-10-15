import { Route, Routes, useNavigate } from 'react-router'
import './App.css'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './ProtetctedRoute'
import AllTask from './components/Alltask'
import UserTasks from './components/UserTasks'
import { useLocation } from 'react-router-dom';
import UserList from './components/UserLists'
import AdminProtected from './AdminProtected'


const Logout = () => {
  localStorage.removeItem("taskToken");
  localStorage.removeItem("taskUser");
  window.location.reload();
}


function App() {
  const backendUrl = "http://localhost:3000"
    const location = useLocation(); 

  return (
    <Routes>
      <Route path='*' element={<Landing />} />
      <Route path='/login' element={<Login backendUrl={backendUrl}/>} />
      <Route path='/register' element={<Register backendUrl={backendUrl}/>} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard backendUrl={backendUrl} /> </ProtectedRoute>} />
      <Route path='/logout' element={<ProtectedRoute><Logout /></ProtectedRoute>} />
      <Route path='/tasks/admin' element={<ProtectedRoute><AdminProtected><AllTask backendUrl={backendUrl}/></AdminProtected></ProtectedRoute>} />
      <Route path='/tasks' element={<ProtectedRoute><UserTasks key={location.key} backendUrl={backendUrl}/></ProtectedRoute>} />
      <Route path='/users' element={<ProtectedRoute><AdminProtected><UserList backendUrl={backendUrl}/></AdminProtected></ProtectedRoute>} />
    </Routes>
  )
}

export default App