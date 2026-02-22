import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './utils/AuthContext'
import { ThemeProvider, useTheme } from './utils/ThemeContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Marquee from './components/Marquee'
import ServiceTiles from './components/ServiceTiles'
import CreateAccount from './components/CreateAccount'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserProfile from './components/UserProfile'
import EditProfile from './components/EditProfile'

function AppContent() {
  const { isLoggedIn, user } = useAuth()
  const { setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'create-account' | 'profile' | 'edit-profile'>('home')

  useEffect(() => {
    if (user && user.themeId) {
      setTheme(user.themeId)
    }
  }, [user, setTheme])

  // If user is logged in
  if (isLoggedIn) {
    // Show profile edit page
    if (currentPage === 'edit-profile') {
      return (
        <div className="app-container">
          <EditProfile
            onLogout={() => {
              setCurrentPage('login')
            }}
            onHomeClick={() => setCurrentPage('home')}
            onProfileClick={() => setCurrentPage('profile')}
            onSave={() => setCurrentPage('profile')}
            onCancel={() => setCurrentPage('profile')}
          />
        </div>
      )
    }

    // Show profile page
    if (currentPage === 'profile') {
      return (
        <div className="app-container">
          <UserProfile
            onLogout={() => {
              setCurrentPage('login')
            }}
            onHomeClick={() => setCurrentPage('home')}
            onProfileClick={() => setCurrentPage('profile')}
            onEditClick={() => setCurrentPage('edit-profile')}
          />
        </div>
      )
    }

    // Show dashboard (home page with tiles)
    return (
      <div className="app-container">
        <Header 
          onMenuClick={() => setMenuOpen(!menuOpen)}
          onHomeClick={() => setCurrentPage('home')}
        />
        <Sidebar
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onProfileClick={() => {
            setMenuOpen(false)
            setCurrentPage('profile')
          }}
          onLogoutClick={() => {
            setMenuOpen(false)
            setCurrentPage('login')
          }}
        />
        <Dashboard />
      </div>
    )
  }

  // If on create account page
  if (currentPage === 'create-account') {
    return (
      <CreateAccount
        onAccountCreated={() => setCurrentPage('login')}
        onCancel={() => setCurrentPage('home')}
      />
    )
  }

  // If on login page
  if (currentPage === 'login') {
    return (
      <Login
        onLoginSuccess={() => setCurrentPage('home')}
        onCreateAccountClick={() => setCurrentPage('create-account')}
      />
    )
  }

  // Home page
  return (
    <div className="app-container">
      <Header 
        onMenuClick={() => setMenuOpen(!menuOpen)}
        onHomeClick={() => setCurrentPage('home')}
      />
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCreateAccountClick={() => {
          setMenuOpen(false)
          setCurrentPage('create-account')
        }}
        onSignInClick={() => {
          setMenuOpen(false)
          setCurrentPage('login')
        }}
      />
      <main className="main-content">
        <Marquee />
        <ServiceTiles />
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
