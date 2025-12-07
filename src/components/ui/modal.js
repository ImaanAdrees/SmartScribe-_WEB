import React from "react";

export function Modal({ open, onOpenChange, children }) {
  if (!open) return null;

  const closeModal = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="w-full" onClick={closeModal}>
        <div
          className="mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
