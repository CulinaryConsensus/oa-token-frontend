import React, { ReactNode, useState } from "react";

interface PaginationResult {
  currentPage: number;
  handlePageChange: (newPage: number) => void;
  pageCount: number;
  controls: ReactNode;
  getSlicedData: () => number[] | undefined;
}

export const usePagination = (
  data: number[] | undefined,
  itemsPerPage: number
): PaginationResult => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil((data?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data?.length || 0);
  const getSlicedData = () => data?.slice(startIndex, endIndex);

  const controls = (
    <div className="join my-3 inline-flex h-12 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]  text-xl font-bold text-white transition-colors">
      <button
        className="btn btn-ghost  join-item"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Prev
      </button>
      <button className="btn btn-ghost join-item no-animation hover:cursor-default hover:bg-transparent ">
        {currentPage} / {pageCount}
      </button>
      <button
        className="btn btn-ghost  join-item"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );

  return { currentPage, handlePageChange, pageCount, controls, getSlicedData };
};
