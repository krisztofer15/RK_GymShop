type Props = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
};

export default function InfoModal({ isOpen, onClose, message, title = "Értesítés" }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold text-[#FF6000] mb-2">{title}</h3>
        <p className="text-gray-800 text-sm mb-4">{message}</p>
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="px-3 py-1 text-sm rounded bg-[#FF6000] text-white hover:bg-[#FFA559] transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
