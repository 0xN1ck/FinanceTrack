import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationForTable = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
    const startPage = Math.max(0, currentPage - 4);
    const endPage = Math.min(startPage + 4, totalPages - 1);

    return (
      <Pagination className="pagination justify-content-center" listClassName="justify-content-center">
        {currentPage !== 0 && (
          <>
            <PaginationItem>
              <PaginationLink first onClick={() => handlePageChange(0)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
          </>
        )}
        {pages.slice(startPage, endPage + 1).map((page) => (
          <PaginationItem key={page} active={page === currentPage}>
            <PaginationLink onClick={() => handlePageChange(page)}>{page + 1}</PaginationLink>
          </PaginationItem>
        ))}
        {currentPage !== totalPages - 1 && (
          <>
            <PaginationItem>
              <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink last onClick={() => handlePageChange(totalPages - 1)} />
            </PaginationItem>
          </>
        )}
      </Pagination>
    );
  };

  return <>{renderPagination()}</>;
};

export default PaginationForTable;