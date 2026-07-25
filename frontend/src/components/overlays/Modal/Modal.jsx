import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from '../../common/Button';

const SIZES = {
  sm: 'max-w-[480px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[900px]',
};

const Modal = ({
  open,
  title,
  children,
  onClose,
  size = 'md',
  className = ''
}) => {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Trap focus roughly (a full implementation would use a library like focus-trap)
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div 
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${sizeClass} bg-[var(--bg-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--border-color)] animate-slide-up ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="!p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close modal"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
