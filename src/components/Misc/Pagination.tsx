import { FunctionComponent } from "react";
import "../../styles/Misc/Pagination.css";

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: FunctionComponent<PaginationProps> = ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage),
    maxVisiblePages = 5,
    halfVisiblePages = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(currentPage - halfVisiblePages, 1);
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber: number, event: React.MouseEvent) => {
    event.preventDefault();
    paginate(pageNumber);
  };

  const renderEllipsis = (key: string, className: string) => (
    <li key={key} className={`page-item disabled ${className}`}>
      <span className="page-link">...</span>
    </li>
  );

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a
            onClick={(e) => handlePageClick(1, e)}
            className="page-link"
            role="button"
            aria-label="First page">
            <i className="fa-solid fa-angle-double-left"></i>
          </a>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a
            onClick={(e) => handlePageClick(currentPage - 1, e)}
            className="page-link"
            role="button"
            aria-label="Previous page">
            <i className="fa-solid fa-angle-left"></i>
          </a>
        </li>
        {startPage > 1 && renderEllipsis("ellipsis-start", "ms-2")}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}>
            <a
              onClick={(e) => handlePageClick(number, e)}
              className="page-link"
              role="button"
              aria-label={`Page ${number}`}>
              {number}
            </a>
          </li>
        ))}
        {endPage < totalPages && renderEllipsis("ellipsis-end", "me-2")}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}>
          <a
            onClick={(e) => handlePageClick(currentPage + 1, e)}
            className="page-link"
            role="button"
            aria-label="Next page">
            <i className="fa-solid fa-angle-right"></i>
          </a>
        </li>
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}>
          <a
            onClick={(e) => handlePageClick(totalPages, e)}
            className="page-link"
            role="button"
            aria-label="Last page">
            <i className="fa-solid fa-angle-double-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
