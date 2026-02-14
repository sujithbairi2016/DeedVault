import React, { useState } from 'react'
import './ServiceTiles.css'
import servicesData from '../../data/services.json'

interface Props {
  serviceId: number
  user?: any
  onCancel: () => void
  onSaved: (serviceId: number, payload: any) => void
}

export default function RequestForm({ serviceId, user, onCancel, onSaved }: Props) {
  const svc = (servicesData as any).find((s: any) => s.id === serviceId) || {}
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const requesterName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  const costRange = svc.minPrice && svc.maxPrice ? `₹${svc.minPrice} - ₹${svc.maxPrice}` : '-'

  const handleSave = () => {
    const now = new Date().toISOString()
    const createdBy = requesterName || 'Anonymous'
    const payload = {
      id: Date.now().toString(),
      serviceId,
      serviceName: svc.title || '',
      subject,
      details,
      requesterName: createdBy,
      createdDate: now,
      modifiedDate: now,
      createdBy,
      modifiedBy: createdBy,
      RequestHistory: '',
      cost: svc.maxPrice || 0,
    }
    onSaved(serviceId, payload)
  }

  return (
    <>
      <div className="modal-overlay" />
      <div className="modal-popup glossy" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h2>New Request</h2>
            <button className="modal-close-btn" onClick={onCancel} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="modal-content">
            <form className="edit-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div className="form-group">
                <label>Service</label>
                <div className="form-label">{svc.title || '-'}</div>
              </div>
              <div className="form-group">
                <label>Requester Name</label>
                <div className="form-label">{requesterName || 'Anonymous'}</div>
              </div>
              <div className="form-group">
                <label>Cost</label>
                <div className="form-label">{costRange}</div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Details</label>
                <textarea value={details} onChange={e => setDetails(e.target.value)} className="form-input" style={{ minHeight: 120 }} />
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </>
  )
}