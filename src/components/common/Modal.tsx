import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  badge,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#24272B] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 text-[#F5F1EB] my-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            {badge && (
              <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-[#FFAD76] bg-[#F07835]/15 px-2.5 py-0.5 rounded-full mb-2">
                {badge}
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F5F1EB]">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A5A5A5] hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

