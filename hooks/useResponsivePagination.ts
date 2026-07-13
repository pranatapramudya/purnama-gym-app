"use client";

import { useState, useEffect, useMemo } from 'react';

export function useResponsivePagination<T>(data: T[]) {
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to desktop initially
  const [currentPage, setCurrentPage] = useState(1);

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(5);
      } else {
        setItemsPerPage(10);
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute derived state
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  
  // Ensure currentPage is valid if data changes or itemsPerPage changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  return {
    itemsPerPage,
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages
  };
}
