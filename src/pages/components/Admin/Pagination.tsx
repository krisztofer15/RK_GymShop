type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  
  export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
  }: Props) {
    return (
      <div className="flex justify-center mt-6 space-x-1">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-[#FF6000] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  }
  