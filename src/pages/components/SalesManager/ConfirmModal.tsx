type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
  };
  
  export default function ConfirmModal({ isOpen, onClose, onConfirm, message }: Props) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
          <p className="text-gray-800 text-sm mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300">
              Mégse
            </button>
            <button onClick={onConfirm} className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600">
              Törlés
            </button>
          </div>
        </div>
      </div>
    );
  }
  