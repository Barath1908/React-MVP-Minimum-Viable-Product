import { useState, useMemo, useCallback } from "react";

const usePagination = (
  data = [],
  itemsPerPage = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    data.length / itemsPerPage
  );

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    const endIndex =
      startIndex + itemsPerPage;

    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  }, []);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    previousPage,
    goToPage,
  };
};

export default usePagination;