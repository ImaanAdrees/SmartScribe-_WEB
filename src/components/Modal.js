export default function Modal({ open, onClose, onConfirm, title, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-96 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2 text-indigo-900">
          {title || "Download SmartScribe"}
        </h2>

        {children ? (
          <div className="mb-6">{children}</div>
        ) : (
          <p className="text-gray-600 mb-6">Do you want to download the app?</p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
