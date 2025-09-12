"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goPrev = () => canPrev && onPageChange(currentPage - 1);
  const goNext = () => canNext && onPageChange(currentPage + 1);

  return (
    <nav aria-label="Pagination" className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={goPrev}
        disabled={!canPrev}
        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
          canPrev
            ? "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        ← Prev
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page <span className="font-semibold">{currentPage}</span> of {totalPages}
      </span>

      <button
        type="button"
        onClick={goNext}
        disabled={!canNext}
        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
          canNext
            ? "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next →
      </button>
    </nav>
  );
};

export default Pagination;

