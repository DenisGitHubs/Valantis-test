import { useDispatch, useSelector } from "react-redux";
import "./pagination.css";
import {
  setCheckPage,
  setCurrentPage,
  setPage,
} from "../../Store/slices/pageSlice";
export const Pagination = ({ allReceivedIDs, onPageChangeNext, setData }) => {
  const filter = useSelector((state) => state.filter.filter);
  const dispatch = useDispatch();
  const { checkPage, currentPage } = useSelector((state) => state.page);

  const goToPrevPage = () => {
    if (currentPage === 1) return;
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };
  // кнопка веперед без фильтра
  const goToNextPage = () => {
    if (currentPage === checkPage) {
      dispatch(setPage(currentPage + 1));
      dispatch(setCheckPage(currentPage + 1));
      onPageChangeNext(currentPage + 1);
      return;
    }
    if (currentPage < checkPage && checkPage - currentPage === 1) {
      dispatch(setCurrentPage(currentPage + 1));
      const oldData = allReceivedIDs.slice(-50);
      setData(oldData);
      return;
    }
    if (currentPage < checkPage) {
      dispatch(setCurrentPage(currentPage + 1));
      return;
    }
  };
  // кнопка веперед с фильтром
  const goToNextPageFilter = () => {
    if (
      allReceivedIDs.length < 50 * currentPage ||
      allReceivedIDs.length === 50 * (currentPage + 1)
    )
      return;
    else {
      dispatch(setPage(currentPage + 1));
      dispatch(setCheckPage(currentPage + 1));
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-arrow" onClick={goToPrevPage}>
        &lt;
      </div>
      <div className="pagination-number">{currentPage}</div>
      <div
        className="pagination-arrow"
        onClick={filter === null ? goToNextPage : goToNextPageFilter}
      >
        &gt;
      </div>
    </div>
  );
};
