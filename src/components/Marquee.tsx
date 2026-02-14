import { useState, useEffect } from 'react'
import './Marquee.css'
import { useAuth } from '../utils/AuthContext'

export default function Marquee() {
  const { user } = useAuth()
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [marqueeText, setMarqueeText] = useState(
    '📢 Welcome to DeedVault - Your trusted property services partner | Quick transactions, verified documents, legal certainty'
  )

  useEffect(() => {
    // Fetch user photo if logged in
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
    // Marquee text can be updated from API or props
    const examples = [
      '📢 Welcome to DeedVault - Your trusted property services partner | Quick transactions, verified documents, legal certainty',
      '⚡ New feature: Fast-track property document verification now available',
      '📰 Latest property market updates available in our News section',
      '✅ 1000+ successful transactions completed this month',
    ]
    
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % examples.length
      setMarqueeText(examples[index])
    }, 8000) // Change every 8 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span>{marqueeText}</span>
        <span>{marqueeText}</span>
      </div>
      {userPhoto && (
        <div className="user-photo-container">
          <img src={userPhoto} alt="User" className="user-photo" />
        </div>
      )}
    </div>
  )
}
