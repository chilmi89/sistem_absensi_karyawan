import React from "react";

export default function Pagination({ meta, onPageChange }) {
    return (
        <div className="flex justify-center gap-2 mt-4">
            <button
                disabled={meta.current_page === 1}
                onClick={() => onPageChange(meta.current_page - 1)}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
            >
                Prev
            </button>

            {[...Array(meta.last_page)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`px-3 py-1 rounded ${
                        meta.current_page === i + 1 ? "bg-blue-500" : "bg-gray-700"
                    }`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                disabled={meta.current_page === meta.last_page}
                onClick={() => onPageChange(meta.current_page + 1)}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
