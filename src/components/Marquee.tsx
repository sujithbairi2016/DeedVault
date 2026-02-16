import { useState, useEffect } from 'react'
import './Marquee.css'
import { useAuth } from '../utils/AuthContext'
import marqueeData from '../../data/marquee.json'

interface MarqueeItem {
  marqueeId: number
  marqueeTitle: string
  marqueeDescription: string
  marqueeReferenceLinks: string[]
}

export default function Marquee() {
  const { user } = useAuth()
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedMarquee, setSelectedMarquee] = useState<MarqueeItem | null>(null)
  const items = marqueeData as MarqueeItem[]

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3001/api/users/${user.id}/photo`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.image) {
            setUserPhoto(data.image)
          }
        })
        .catch(err => console.error('Failed to load user photo', err))
    } else {
      setUserPhoto(null)
    }
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [items.length])

  const handleMarqueeClick = () => {
    setSelectedMarquee(items[currentIndex])
  }

  const handleCloseDialog = () => {
    setSelectedMarquee(null)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseDialog()
      }
    }
    if (selectedMarquee) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [selectedMarquee])

  const userName = user ? `${user.firstName} ${user.lastName}`.trim() : ''

  return (
    <>
      <div className="marquee-container">
        <div className="marquee-content" onClick={handleMarqueeClick} style={{ cursor: 'pointer' }}>
          <span>📢 {items[currentIndex].marqueeTitle}</span>
          <span>📢 {items[currentIndex].marqueeTitle}</span>
        </div>
        {user && (
          <div className="user-info-container">
            {userPhoto && <img src={userPhoto} alt="User" className="user-photo" />}
            {userName && <span className="user-name">{userName}</span>}
          </div>
        )}
      </div>

      {selectedMarquee && (
        <>
          <div className="marquee-dialog-overlay" onClick={handleCloseDialog} />
          <div className="marquee-dialog">
            <div className="marquee-dialog-header">
              <h2>{selectedMarquee.marqueeTitle}</h2>
              <button className="marquee-dialog-close" onClick={handleCloseDialog} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="marquee-dialog-content">
              <p>{selectedMarquee.marqueeDescription}</p>
              {selectedMarquee.marqueeReferenceLinks.length > 0 && (
                <>
                  <h3>Reference Links:</h3>
                  <ul>
                    {selectedMarquee.marqueeReferenceLinks.map((link, idx) => (
                      <li key={idx}>{link}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
