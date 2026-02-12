import './Sidebar.css'
import { useAuth } from '../utils/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onCreateAccountClick?: () => void
  onSignInClick?: () => void
  onProfileClick?: () => void
  onLogoutClick?: () => void
}

export default function Sidebar({ isOpen, onClose, onCreateAccountClick, onSignInClick, onProfileClick, onLogoutClick }: SidebarProps) {
  const { isLoggedIn } = useAuth()

  const handleCreateAccount = () => {
    if (onCreateAccountClick) {
      onCreateAccountClick()
    }
  }

  const handleSignIn = () => {
    if (onSignInClick) {
      onSignInClick()
    }
  }

  const handleProfile = () => {
    onClose()
    if (onProfileClick) {
      onProfileClick()
    }
  }

  const handleLogout = () => {
    onClose()
    if (onLogoutClick) {
      onLogoutClick()
    }
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          {isLoggedIn ? (
            <>
              <button
                className="sidebar-link"
                onClick={handleProfile}
              >
                👤 My Profile
              </button>
              <a
                href="#about"
                className="sidebar-link"
                onClick={onClose}
              >
                About Us
              </a>
              <button
                className="sidebar-link logout-link"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="sidebar-link"
                onClick={handleCreateAccount}
              >
                Create Account
              </button>
              <button
                className="sidebar-link"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <a
                href="#about"
                className="sidebar-link"
                onClick={onClose}
              >
                About Us
              </a>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
