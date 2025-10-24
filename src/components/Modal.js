export default function Modal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-80 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-2 text-primary">
          Download SmartScribe
        </h2>
        <p className="text-muted mb-4">Do you want to download the app?</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="border border-blue-200 text-primary px-4 py-2 rounded-lg font-semibold"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
