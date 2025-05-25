import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'react-hot-toast';  
import EditorPage from "./pages/EditorPage";
import './App.css';



function App() {
    return (
        <Router>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                
                <Route path="/" element={<Main />} />
                <Route path="/" element={<Home />} />
            <Route path="/editor/:roomId" element={<EditorPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
