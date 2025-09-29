import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EditorProvider } from './context/EditorContext'
import { ProfAiProvider } from './context/ProfAiContext'
import { EditorRefProvider } from './context/EditorRefContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import EditorUnified from './pages/EditorUnified'
import History from './pages/History'
import Help from './pages/Help'
import About from './pages/About'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <AuthProvider>
      <EditorProvider>
        <ProfAiProvider>
          <EditorRefProvider>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/auth/callback" element={<Layout><AuthCallback /></Layout>} />
              <Route path="/editor" element={<EditorUnified />} />
              <Route path="/history" element={<Layout><History /></Layout>} />
              <Route path="/help" element={<Layout><Help /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
            </Routes>
          </EditorRefProvider>
        </ProfAiProvider>
      </EditorProvider>
    </AuthProvider>
  )
}

export default App

