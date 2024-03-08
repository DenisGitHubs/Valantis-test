import React, { useState } from "react";
import "./filter.css";
import { useDispatch, useSelector } from "react-redux";
import { removeFilter, setFilter } from "../../Store/slices/filterSlice";
import { useEffect } from "react";
import { setCheckPage, setCurrentPage } from "../../Store/slices/pageSlice";

export const FilterMenu = ({
  startSearch,
  setAllReceivedIDs,
  setShowNumGoods,
  setData,
  setIsFind,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const filter = useSelector((state) => state.filter.filter);
  const dispatch = useDispatch();
  // проверка на пустое поле ввода
  useEffect(() => {
    if (showWarning === true && inputValue !== "") {
      setShowWarning(false);
    }
  }, [inputValue, showWarning]);
  // выбор фильтра или удаление фильтра
  const handleChange = (handleFilter) => {
    if (filter === handleFilter) {
      setShowNumGoods(false);
      dispatch(setCurrentPage(1));
      dispatch(setCheckPage(1));
      dispatch(removeFilter());
      setInputValue("");
      if (isClick) {
        setAllReceivedIDs([]);
        setData([]);
        setIsClick(false);
      }
    } else {
      setIsFind(false);
      dispatch(setFilter(handleFilter));
    }
  };

  const handleClickSearch = () => {
    if (filter === null) return;
    if (inputValue === "") {
      setShowWarning(true);
      return;
    } else {
      setIsClick(true);
      setAllReceivedIDs([]);
      startSearch(inputValue);
    }
  };
  return (
    <>
      <div className="filter-menu">
        <b>Фильтры</b>
        <ul className="filters">
          <li
            onClick={() => handleChange("product")}
            className={filter === "product" ? "selected" : ""}
          >
            Название
          </li>
          <li
            onClick={() => handleChange("price")}
            className={filter === "price" ? "selected" : ""}
          >
            Цена
          </li>
          <li
            onClick={() => handleChange("brand")}
            className={filter === "brand" ? "selected" : ""}
          >
            Бренд
          </li>
        </ul>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введите данные"
          className={filter ? "active" : ""}
          disabled={!filter}
        />
        <button className={filter ? "active" : ""} onClick={handleClickSearch}>
          Поиск
        </button>
      </div>
      {showWarning === true ? (
        <p className="empty-field">Введите данные для поиска</p>
      ) : null}
    </>
  );
};
