import React from 'react'
import './ServiceTiles.css'
import { useAuth } from '../utils/AuthContext'

interface Props {
  serviceId: number
  onClose: () => void
  onNewRequest: () => void
}

const serviceContent: Record<number, { title: string; body: string }> = {
  1: {
    title: 'Raise Property Document Verification',
    body: 'We verify property documents with legal experts. Typical turnaround: 2-3 business days. Requirements: scanned copies of title documents, ID proof.',
  },
  2: { title: 'Property Documents Services', body: 'Preparation and management of property documents including sale deeds, agreements, and transfers.' },
  3: { title: 'Newspaper Notices', body: 'Publication of legal notices and public announcements in leading newspapers.' },
  4: { title: 'Legal Opinion', body: 'Get expert legal opinions from certified lawyers on property matters.' },
  5: { title: 'Properties for Sale', body: 'Search and browse verified properties available for purchase.' },
  6: { title: 'Title Insurance', body: 'Title insurance protects against defects in property title discovered after purchase.' },
}

export default function ServiceModal({ serviceId, onClose, onNewRequest }: Props) {
  const content = serviceContent[serviceId] || { title: 'Service', body: 'Details not available.' }
  const { user } = useAuth()

  const handleClose = () => {
    // navigate back to home route if needed
    onClose()
    // keep user on page - main app will remain
  }

  return (
    <>
      <div className="modal-overlay" />
      <div className="modal-popup">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              className="btn-new-request" 
              onClick={onNewRequest} 
              style={{ marginRight: 8 }}
              disabled={!user}
            >
              New Request
            </button>
            <h2>{content.title}</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => {
              handleClose()
              // navigate to home (root) — using window.location to satisfy requirement
              window.location.href = '/'
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          <p style={{ color: '#444', lineHeight: 1.6 }}>{content.body}</p>
        </div>
      </div>
    </>
  )
}
