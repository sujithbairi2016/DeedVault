import { useState, useRef, useEffect } from 'react';
import './FilterDropdown.css';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  columnName: string;
}

export default function FilterDropdown({ value, onChange, columnName }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    onChange(filterText);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilterText('');
    onChange('');
  };

  return (
    <div className="filter-dropdown-container" ref={dropdownRef}>
      <button 
        className={`filter-icon-btn ${value ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`Filter ${columnName}`}
      >
        ⚡
      </button>
      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-input-group">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={`Filter ${columnName}...`}
              className="filter-dropdown-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApply();
                if (e.key === 'Escape') setIsOpen(false);
              }}
              autoFocus
            />
            {filterText && (
              <button className="filter-clear-btn" onClick={handleClear} title="Clear filter">
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
