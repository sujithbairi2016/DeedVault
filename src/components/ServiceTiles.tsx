import { useEffect, useRef, useState } from 'react'
import './ServiceTiles.css'
import ServiceModal from './ServiceModal'
import RequestForm from './RequestForm'
import FilterDropdown from './FilterDropdown'
import { useAuth } from '../utils/AuthContext'
import servicesData from '../../data/services.json'

interface Service {
  id: number
  title: string
  description: string
  priceRange?: string
  icon: string
  minPrice?: number
  maxPrice?: number
}

const services: Service[] = (servicesData as unknown) as Service[]

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === '-') return '-'
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export default function ServiceTiles() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState<any | null>(null)
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [serviceRecords, setServiceRecords] = useState<any[]>([])
  const [sortColumn, setSortColumn] = useState<string>('modifiedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)
  const [hoveredService, setHoveredService] = useState<{text: string, x: number, y: number} | null>(null)
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  const handleEditClick = (record: any) => {
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

  const handleCancel = () => {
    setShowEditModal(false)
    setSelectedRecord(null)
    setFormData(null)
  }

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/requests')
      if (!res.ok) return
      const data = await res.json()
      const activeRecords = (data.requests || []).filter((r: any) => r.IsActive === 1)
      setServiceRecords(activeRecords)
    } catch (err) {
      console.error('Failed to fetch requests', err)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowEditModal(false)
        setShowServiceModal(false)
        setShowRequestForm(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const openLearnMore = (serviceId: number) => {
    setSelectedService(serviceId)
    setShowServiceModal(true)
  }

  const openRequestForm = (serviceId: number) => {
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
      await fetchRequests()
    } catch (err) {
      console.error('Failed to save request', err)
    }
    setShowRequestForm(false)
    setSelectedService(null)
  }

  const handleDeactivate = async (record: any) => {
    try {
      const updated = { ...record, StatusId: 5, modifiedDate: new Date().toISOString() }
      await fetch(`http://localhost:3001/api/requests/${record.serviceId}/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      await fetchRequests()
    } catch (err) {
      console.error('Failed to deactivate request', err)
    }
  }

  const handleDelete = async (record: any) => {
    try {
      const updated = { ...record, IsActive: 0, modifiedDate: new Date().toISOString() }
      await fetch(`http://localhost:3001/api/requests/${record.serviceId}/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      await fetchRequests()
    } catch (err) {
      console.error('Failed to delete request', err)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const handleFilterChange = (column: string, value: string) => {
    setFilters({ ...filters, [column]: value })
    setCurrentPage(1)
  }

  const handleServiceMouseEnter = (text: string, e: React.MouseEvent) => {
    if (text.length > 15) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setHoveredService({ text, x: rect.left, y: rect.bottom + 5 })
      if (tooltipTimeout) clearTimeout(tooltipTimeout)
      const timeout = setTimeout(() => setHoveredService(null), 5000)
      setTooltipTimeout(timeout)
    }
  }

  const handleServiceMouseLeave = () => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout)
    setHoveredService(null)
  }

  const getFilteredAndSortedRecords = () => {
    let filtered = [...serviceRecords]

    Object.keys(filters).forEach(column => {
      const filterValue = filters[column].toLowerCase()
      if (filterValue) {
        filtered = filtered.filter((record: any) => {
          const svc = services.find(s => s.id === record.serviceId)
          let value = ''
          if (column === 'name') value = (record.name || svc?.title || '').toLowerCase()
          else if (column === 'id') value = (record.id || '').toLowerCase()
          else if (column === 'createdDate') value = formatDate(record.createdDate || '').toLowerCase()
          else if (column === 'modifiedDate') value = formatDate(record.modifiedDate || '').toLowerCase()
          else if (column === 'modifiedBy') value = (record.modifiedBy || '').toLowerCase()
          return value.includes(filterValue)
        })
      }
    })

    filtered.sort((a: any, b: any) => {
      let aVal: any, bVal: any
      const svcA = services.find(s => s.id === a.serviceId)
      const svcB = services.find(s => s.id === b.serviceId)

      if (sortColumn === 'name') {
        aVal = (a.name || svcA?.title || '').toLowerCase()
        bVal = (b.name || svcB?.title || '').toLowerCase()
      } else if (sortColumn === 'id') {
        aVal = a.id || ''
        bVal = b.id || ''
      } else if (sortColumn === 'createdDate' || sortColumn === 'modifiedDate') {
        aVal = new Date(a[sortColumn] || 0).getTime()
        bVal = new Date(b[sortColumn] || 0).getTime()
      } else if (sortColumn === 'modifiedBy') {
        aVal = (a.modifiedBy || '').toLowerCase()
        bVal = (b.modifiedBy || '').toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }

  const filteredRecords = getFilteredAndSortedRecords()
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage)

  return (
    <section className="services-section">
      <div className="services-header">
        <h2>Our Services</h2>
        <p>Trusted property solutions for a secure real estate experience</p>
      </div>

      <div className="horizontal-tiles-wrapper">
        <button className="scroll-btn scroll-btn-left" onClick={() => scroll('left')} aria-label="Scroll left">❮</button>
        <div className="horizontal-tiles-container" ref={scrollContainerRef}>
          {services.map((service) => {
            const priceDisplay = service.minPrice && service.maxPrice ? `₹${service.minPrice} - ₹${service.maxPrice}` : service.priceRange || '-'
            return (
            <div key={service.id} className="service-tile-horizontal">
              <div className="tile-price">{priceDisplay}</div>
              <div className="tile-icon">{service.icon}</div>
              <h3 className="tile-title">{service.title}</h3>
              <p className="tile-description">{service.description}</p>
              <button className="tile-button" onClick={() => openLearnMore(service.id)}>Learn More</button>
            </div>
            )
          })}
        </div>
        <button className="scroll-btn scroll-btn-right" onClick={() => scroll('right')} aria-label="Scroll right">❯</button>
      </div>

      {user && (
      <div className="services-grid-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 className="grid-title">Service Records</h3>
          <button className="refresh-btn" onClick={fetchRequests} title="Refresh records" aria-label="Refresh records">🔄 Refresh</button>
        </div>
        <div className="grid-table-container">
          <table className="services-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} style={{cursor: 'pointer'}}>
                  ID {sortColumn === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
                  <FilterDropdown value={filters.id || ''} onChange={(val) => handleFilterChange('id', val)} columnName="ID" />
                </th>
                <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>
                  Name of the Service {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                  <FilterDropdown value={filters.name || ''} onChange={(val) => handleFilterChange('name', val)} columnName="Name" />
                </th>
                <th onClick={() => handleSort('createdDate')} style={{cursor: 'pointer'}}>
                  Created Date {sortColumn === 'createdDate' && (sortDirection === 'asc' ? '▲' : '▼')}
                  <FilterDropdown value={filters.createdDate || ''} onChange={(val) => handleFilterChange('createdDate', val)} columnName="Created Date" />
                </th>
                <th onClick={() => handleSort('modifiedDate')} style={{cursor: 'pointer'}}>
                  Modified Date {sortColumn === 'modifiedDate' && (sortDirection === 'asc' ? '▲' : '▼')}
                  <FilterDropdown value={filters.modifiedDate || ''} onChange={(val) => handleFilterChange('modifiedDate', val)} columnName="Modified Date" />
                </th>
                <th onClick={() => handleSort('modifiedBy')} style={{cursor: 'pointer'}}>
                  Modified By {sortColumn === 'modifiedBy' && (sortDirection === 'asc' ? '▲' : '▼')}
                  <FilterDropdown value={filters.modifiedBy || ''} onChange={(val) => handleFilterChange('modifiedBy', val)} columnName="Modified By" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record: any) => {
                const id = record.id || `${record.serviceId || 's'}-${Math.random().toString(36).slice(2, 8)}`
                const svc = services.find(s => s.id === record.serviceId)
                const name = record.name || svc?.title || `Service ${record.serviceId || ''}`
                const created = formatDate(record.createdDate || record.createdAt || '-')
                const modifiedDate = formatDate(record.modifiedDate || '-')
                const modifiedBy = record.modifiedBy || record.requesterName || '-'

                return (
                  <tr key={id} className={selectedRecord?.id === id ? 'row-highlighted' : ''}>
                    <td>{id}</td>
                    <td 
                      onMouseEnter={(e) => handleServiceMouseEnter(name, e)}
                      onMouseLeave={handleServiceMouseLeave}
                      style={{cursor: name.length > 15 ? 'help' : 'default'}}
                    >
                      {truncateText(name, 15)}
                    </td>
                    <td>{created}</td>
                    <td>{modifiedDate}</td>
                    <td>{modifiedBy}</td>
                    <td>
                      <button className="edit-icon-btn" onClick={() => handleEditClick(record)} title="Edit record" aria-label="Edit record">✏️</button>
                      <button className="deactivate-icon-btn" onClick={() => handleDeactivate(record)} title="Deactivate record" aria-label="Deactivate record">🚫</button>
                      <button className="delete-icon-btn" onClick={() => handleDelete(record)} title="Delete record" aria-label="Delete record">🗑️</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
          </div>
        )}
      </div>
      )}

      {hoveredService && (
        <div className="service-tooltip" style={{left: hoveredService.x, top: hoveredService.y}}>
          {hoveredService.text}
        </div>
      )}

      {showEditModal && (
        <>
          <div className="modal-overlay" onClick={handleCancel}></div>
          <div className="modal-popup">
            <div className="modal-header">
              <h2>Edit Service Record</h2>
              <button className="modal-close-btn" onClick={handleCancel} aria-label="Close modal">✕</button>
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
                  <input className="form-input" value={formData?.subject || ''} onChange={e => setFormData({ ...(formData as any), subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Details</label>
                  <textarea className="form-input" value={formData?.details || ''} onChange={e => setFormData({ ...(formData as any), details: e.target.value })} style={{ minHeight: 120 }} />
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
                  <input type="number" className="form-input" value={formData?.cost || 0} onChange={e => setFormData({ ...(formData as any), cost: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>Current Request History</label>
                  <textarea readOnly className="form-input" style={{ minHeight: 120 }} value={formData?.RequestHistory || ''} />
                </div>
                <div className="form-group">
                  <label>Add to Request History (only editable here)</label>
                  <textarea value={(formData as any)?.__newHistory || ''} onChange={(e) => setFormData({ ...(formData as any), __newHistory: e.target.value })} className="form-input" placeholder="Enter comments to append to Request History" style={{ minHeight: 120 }} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
              <button className="btn-save" onClick={async () => {
                if (!formData) return
                const newEntry = (formData as any).__newHistory || ''
                const now = new Date().toISOString()
                const modifiedBy = user ? `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() : 'Anonymous'
                let updated = { ...(formData as any) }
                if (!updated.RequestHistory) updated.RequestHistory = ''
                if (newEntry && newEntry.trim().length > 0) {
                  const entryLine = `[${now}] ${modifiedBy}: ${newEntry.trim()}`
                  updated.RequestHistory = `${updated.RequestHistory}${updated.RequestHistory ? '\n' : ''}${entryLine}`
                }
                updated.modifiedDate = now
                updated.modifiedBy = modifiedBy
                try {
                  const svcId = updated.serviceId
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
                await fetchRequests()
                setShowEditModal(false)
                setSelectedRecord(null)
                setFormData(null)
              }}>Save</button>
            </div>
          </div>
        </>
      )}

      {showServiceModal && selectedService && (
        <ServiceModal serviceId={selectedService} onClose={() => setShowServiceModal(false)} onNewRequest={() => openRequestForm(selectedService)} />
      )}

      {showRequestForm && selectedService && (
        <RequestForm serviceId={selectedService} user={user} onCancel={handleRequestFormCancel} onSaved={handleRequestFormSaved} />
      )}
    </section>
  )
}
