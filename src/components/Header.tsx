import './Header.css'

interface HeaderProps {
  onMenuClick: () => void
  onHomeClick?: () => void
}

export default function Header({ onMenuClick, onHomeClick }: HeaderProps) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        <span className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {onHomeClick && (
        <button className="home-icon-btn" onClick={onHomeClick} aria-label="Go to home" title="Home">
          🏠
        </button>
      )}
      
      <div className="header-spacer"></div>

      <div className="header-right">
        <img src="/DeedVaultLog.jpg" alt="DeedVault Logo" className="logo-image" />
      </div>
    </header>
  )
}
