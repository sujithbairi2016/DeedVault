import { useEffect, useRef, useState } from 'react'
import './ServiceTiles.css'
import ServiceModal from './ServiceModal'
import RequestForm from './RequestForm'
import { useAuth } from '../utils/AuthContext'
import servicesData from '../../data/services.json'

interface Service {
  id: number
  title: string
  description: string
  priceRange?: string
  icon: string
}

interface ServiceRecord {
  id: string
  name: string
  createdDate: string
  modifiedDate: string
  modifiedBy: string
  cost: number
}

const services: Service[] = (servicesData as unknown) as Service[]

export default function ServiceTiles() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState<any | null>(null)

  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)

  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      if (direction === 'left') {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  const handleEditClick = (record: any) => {
    // ensure subject/serviceDescription present by enriching with service metadata if missing
    const svc = services.find(s => s.id === record.serviceId)
    const enriched = {
      ...record,
      subject: record.subject || svc?.title,
      serviceDescription: record.serviceDescription || svc?.description,
    }
    setSelectedRecord(enriched)
    setFormData({ ...enriched })
    setShowEditModal(true)
  }

  const handleSave = () => {
    if (formData) {
      console.log('Saving record:', formData)
      // Here you would typically send the data to your backend API
      setShowEditModal(false)
      setSelectedRecord(null)
      setFormData(null)
    }
  }

  const handleCancel = () => {
    setShowEditModal(false)
    setSelectedRecord(null)
    setFormData(null)
  }

  // Fetch combined requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/requests')
        if (!res.ok) return
        const data = await res.json()
        setServiceRecords(data.requests || [])
      } catch (err) {
        console.error('Failed to fetch requests', err)
      }
    }
    fetchRequests()
  }, [])

  const openLearnMore = (serviceId: number) => {
    setSelectedService(serviceId)
    setShowServiceModal(true)
  }

  const openRequestForm = (serviceId: number) => {
    // close learn more and open form on top
    setShowServiceModal(false)
    setSelectedService(serviceId)
    setShowRequestForm(true)
  }

  const handleRequestFormCancel = () => {
    setShowRequestForm(false)
    setSelectedService(null)
  }

  const handleRequestFormSaved = async (serviceId: number, payload: any) => {
    try {
      await fetch(`http://localhost:3001/api/requests/${serviceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      // refresh grid
      const res = await fetch('http://localhost:3001/api/requests')
      if (res.ok) {
        const data = await res.json()
        setServiceRecords(data.requests || [])
      }
    } catch (err) {
      console.error('Failed to save request', err)
    }
    setShowRequestForm(false)
    setSelectedService(null)
  }

  const handleFormChange = (field: keyof ServiceRecord, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value })
    }
  }

  return (
    <section className="services-section">
      <div className="services-header">
        <h2>Our Services</h2>
        <p>Trusted property solutions for a secure real estate experience</p>
      </div>

      {/* Horizontal Scrollable Tiles */}
      <div className="horizontal-tiles-wrapper">
        <button className="scroll-btn scroll-btn-left" onClick={() => scroll('left')} aria-label="Scroll left">
          ❮
        </button>
        <div className="horizontal-tiles-container" ref={scrollContainerRef}>
          {services.map((service) => (
            <div key={service.id} className="service-tile-horizontal">
              {service.priceRange && <div className="tile-price">{service.priceRange}</div>}
              <div className="tile-icon">{service.icon}</div>
              <h3 className="tile-title">{service.title}</h3>
              <p className="tile-description">{service.description}</p>
              <button className="tile-button" onClick={() => openLearnMore(service.id)}>
                Learn More
              </button>
            </div>
          ))}
        </div>
        <button className="scroll-btn scroll-btn-right" onClick={() => scroll('right')} aria-label="Scroll right">
          ❯
        </button>
      </div>

      {/* Services Grid/Table */}
      <div className="services-grid-wrapper">
        <h3 className="grid-title">Service Records</h3>
        <div className="grid-table-container">
          <table className="services-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name of the Service</th>
                <th>Created Date</th>
                <th>Modified Date</th>
                <th>Modified By</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceRecords.map((record: any) => {
                const id = record.id || `${record.serviceId || 's'}-${Math.random().toString(36).slice(2, 8)}`
                const svc = services.find(s => s.id === record.serviceId)
                const name = record.name || svc?.title || `Service ${record.serviceId || ''}`
                const created = record.createdDate || record.createdAt || '-'
                const modifiedDate = record.modifiedDate || '-'
                const modifiedBy = record.modifiedBy || record.requesterName || '-'
                const cost = typeof record.cost === 'number' ? record.cost : 0

                return (
                  <tr key={id} className={selectedRecord?.id === id ? 'row-highlighted' : ''}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{created}</td>
                    <td>{modifiedDate}</td>
                    <td>{modifiedBy}</td>
                    <td>${cost.toFixed(2)}</td>
                    <td>
                      <button
                        className="edit-icon-btn"
                        onClick={() => handleEditClick(record)}
                        title="Edit record"
                        aria-label="Edit record"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div className="modal-overlay" onClick={handleCancel}></div>
          <div className="modal-popup">
            <div className="modal-header">
              <h2>Edit Service Record</h2>
              <button className="modal-close-btn" onClick={handleCancel} aria-label="Close modal">
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="edit-form">
                <div className="form-group">
                  <label>ID</label>
                  <div className="form-label">{formData?.id || '-'}</div>
                </div>

                <div className="form-group">
                  <label>Service</label>
                  <div className="form-label">{(() => {
                    const svc = services.find(s => s.id === formData?.serviceId)
                    return svc?.title || '-'
                  })()}</div>
                </div>
                <div className="form-group">
                  <label>Requester Name</label>
                  <div className="form-label">{formData?.requesterName || '-'}</div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    className="form-input"
                    value={formData?.subject || ''}
                    onChange={e => setFormData({ ...(formData as any), subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Details</label>
                  <textarea
                    className="form-input"
                    value={formData?.details || ''}
                    onChange={e => setFormData({ ...(formData as any), details: e.target.value })}
                    style={{ minHeight: 120 }}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Created Date</label>
                    <div className="form-label">{formData?.createdDate || formData?.createdAt || '-'}</div>
                  </div>

                  <div className="form-group">
                    <label>Modified Date</label>
                    <div className="form-label">{formData?.modifiedDate || '-'}</div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Modified By</label>
                  <div className="form-label">{formData?.modifiedBy || '-'}</div>
                </div>

                <div className="form-group">
                  <label>Cost</label>
                  <div className="form-label">{typeof formData?.cost === 'number' ? `$${formData.cost.toFixed(2)}` : '-'}</div>
                </div>

                <div className="form-group">
                  <label>Current Request History</label>
                  <textarea readOnly className="form-input" style={{ minHeight: 120 }} value={formData?.RequestHistory || ''} />
                </div>

                <div className="form-group">
                  <label>Add to Request History (only editable here)</label>
                  <textarea
                    value={(formData as any)?.__newHistory || ''}
                    onChange={(e) => setFormData({ ...(formData as any), __newHistory: e.target.value })}
                    className="form-input"
                    placeholder="Enter comments to append to Request History"
                    style={{ minHeight: 120 }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={async () => {
                  // On save, append RequestHistory with timestamp and modifiedBy
                  if (!formData) return
                  const newEntry = (formData as any).__newHistory || ''
                  const now = new Date().toISOString()
                  const modifiedBy = user ? `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() : 'Anonymous'

                  let updated = { ...(formData as any) }
                  // ensure RequestHistory exists
                  if (!updated.RequestHistory) updated.RequestHistory = ''
                  if (newEntry && newEntry.trim().length > 0) {
                    const entryLine = `[${now}] ${modifiedBy}: ${newEntry.trim()}`
                    updated.RequestHistory = `${updated.RequestHistory}${updated.RequestHistory ? '\n' : ''}${entryLine}`
                  }

                  updated.modifiedDate = now
                  updated.modifiedBy = modifiedBy

                  try {
                    // send PUT to server
                    const svcId = updated.serviceId || updated.serviceId === 0 ? updated.serviceId : updated.serviceId || updated.serviceId
                    const reqId = updated.id
                    if (svcId && reqId) {
                      await fetch(`http://localhost:3001/api/requests/${svcId}/${reqId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updated),
                      })
                    }
                  } catch (err) {
                    console.error('Failed to update request', err)
                  }

                  // refresh grid
                  try {
                    const res = await fetch('http://localhost:3001/api/requests')
                    if (res.ok) {
                      const data = await res.json()
                      setServiceRecords(data.requests || [])
                    }
                  } catch (e) {
                    console.error('Failed to refresh requests', e)
                  }

                  setShowEditModal(false)
                  setSelectedRecord(null)
                  setFormData(null)
                }}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {/* Service LearnMore Modal */}
      {showServiceModal && selectedService && (
        <ServiceModal
          serviceId={selectedService}
          onClose={() => setShowServiceModal(false)}
          onNewRequest={() => openRequestForm(selectedService)}
        />
      )}

      {/* Request Form Modal */}
      {showRequestForm && selectedService && (
        <RequestForm
          serviceId={selectedService}
          user={user}
          onCancel={handleRequestFormCancel}
          onSaved={handleRequestFormSaved}
        />
      )}
    </section>
  )
}
