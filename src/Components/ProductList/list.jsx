import "./list.css";
import { Pagination } from "../Pagination/pagination";
import { sendRequest } from "../../API/api";
import { useCallback, useEffect, useState } from "react";
import { ProductItem } from "../ProductItem/item";
import { FilterMenu } from "../Filter/filter";
import {
  editAllId,
  getNames,
  getNewSet,
  removeDuplicates,
  saveCombinedData,
  saveIDFilter,
} from "../../Helpers/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "../../Store/slices/pageSlice";

export const ProductList = () => {
  const [data, setData] = useState([]);
  const [allReceivedIDs, setAllReceivedIDs] = useState([]);
  const [items, setItems] = useState([]);
  const [showNumGoods, setShowNumGoods] = useState(false);
  const [isFind, setIsFind] = useState(false);
  const { checkPage, currentPage } = useSelector((state) => state.page);
  const filter = useSelector((state) => state.filter.filter);
  const dispatch = useDispatch();

  // ф-я получения данных, если данных для текущей страницы меньше 50 после удаления дублей
  const secondAdd = useCallback(
    async (offset, limit, addOffset) => {
      const response = await sendRequest("get_ids", {
        offset: offset,
        limit: limit,
      });
      if (response && data.length < 50) {
        const newData = removeDuplicates(response.result, allReceivedIDs);
        if (newData.length === 0) {
          secondAdd(addOffset + 1, limit, addOffset);
          return;
        }
        saveCombinedData(setData, response.result);
        editAllId(response.result, setAllReceivedIDs);
      } else {
        secondAdd(offset, limit);
      }
    },
    [data, allReceivedIDs, setData]
  );

  // ф-я получения Id для текущей страницы
  const onPageChangeNext = useCallback(
    async (page) => {
      const offset = page * 50 - 50;
      if (filter === null) {
        const response = await sendRequest("get_ids", {
          offset: offset,
          limit: 50,
        });
        if (response && allReceivedIDs.length > 0) {
          setData((prevState) => {
            let newData = prevState;
            newData = removeDuplicates(response.result, allReceivedIDs);
            return newData;
          });
          editAllId(response.result, setAllReceivedIDs);
        } else if (response && allReceivedIDs.length === 0) {
          setData(getNewSet(response.result));
          editAllId(response.result, setAllReceivedIDs);
        } else {
          onPageChangeNext(page);
        }
      }
    },
    [filter, allReceivedIDs, setData]
  );

  // первый запрос для получения данных с API
  useEffect(() => {
    if (currentPage === 1 && data.length === 0 && filter === null) {
      onPageChangeNext(currentPage);
    }
  }, [currentPage, data, filter, onPageChangeNext]);

  // очистка поля и получение подробных данных о товарах и внесение их в стейт для вывода.
  useEffect(() => {
    if (
      allReceivedIDs.length % 50 === 0 &&
      allReceivedIDs.length > 0 &&
      filter === null
    ) {
      setItems([]);
      getNames(data, setItems);
    }
  }, [allReceivedIDs.length, data, filter]);

  // запись 50 ID для текущей страницы. при использовании фильтра из списка ранее полученных всех ID
  useEffect(() => {
    if (allReceivedIDs.length > 0 && filter !== null) {
      let dataIdForPage;
      const step = currentPage * 50 - 50;
      if (allReceivedIDs.length < step + 50) {
        const count = allReceivedIDs.length % 50;
        dataIdForPage = allReceivedIDs.slice(step, step + count);
      } else {
        dataIdForPage = allReceivedIDs.slice(step, step + 50);
      }
      setData(dataIdForPage);
    }
  }, [allReceivedIDs.length, currentPage, allReceivedIDs, filter]);

  // определяем, что полученные данные, после удаления дублей, меньше 50 и дополучаем, то кол-во, что не хватает
  useEffect(() => {
    if (data.length < 50 && data.length > 0 && filter === null) {
      const offset = currentPage * 50 + (50 - data.length);
      const limit = 50 - data.length;
      const addOffset = offset + data.length;
      secondAdd(offset, limit, addOffset);
    }
  }, [data, currentPage, allReceivedIDs, filter, secondAdd]);

  // при нажатии кнопки назад, мы не делаем запросы снова, а используем полученные ранее ID.
  useEffect(() => {
    if (currentPage < checkPage && filter === null) {
      const step = (currentPage - checkPage - 1) * 50;
      const count = (currentPage - checkPage) * 50;
      const oldData = allReceivedIDs.slice(step, count);
      setData(oldData);
    }
  }, [checkPage, currentPage, allReceivedIDs, filter]);
  // получаем данные по ID, для данных полученных по поиску.
  useEffect(() => {
    if (filter !== null && isFind) {
      getNames(getNewSet(data), setItems);
    }
  }, [data, filter]);

  // ф-я для повторного запроса для фильтра "product" т.к. API чувствителен к регистру. здесь делаем заглавной первую букву первого слова
  const secondFilterSearch = async (requestValue) => {
    const requestValueUpper =
      requestValue.charAt(0).toUpperCase() + requestValue.slice(1);
    const response = await sendRequest("filter", {
      [filter]: requestValueUpper,
    });
    if (response) {
      saveCombinedData(setAllReceivedIDs, response.result);
    } else secondFilterSearch(requestValue);
  };

  // ф-я для поиска товаров по фильтрам
  const startSearch = async (inputValue) => {
    setIsFind(false);
    setShowNumGoods(false);
    dispatch(setCurrentPage(1));
    setItems([]);
    setAllReceivedIDs([]);
    let requestValue = inputValue;
    if (filter === "price") {
      requestValue = Number(requestValue);
      await saveIDFilter(requestValue, filter, setAllReceivedIDs);
    }
    if (filter === "product") {
      requestValue = requestValue.toLowerCase();
      await saveIDFilter(requestValue, filter, setAllReceivedIDs);
      requestValue =
        requestValue.charAt(0).toUpperCase() + requestValue.slice(1);
      await secondFilterSearch(requestValue);
    }
    if (filter === "brand") {
      requestValue =
        requestValue.charAt(0).toUpperCase() + requestValue.slice(1);
      await saveIDFilter(requestValue, filter, setAllReceivedIDs);
    }
    setShowNumGoods(true);
    setIsFind(true);
  };

  return (
    <div className="container">
      <FilterMenu
        startSearch={startSearch}
        setAllReceivedIDs={setAllReceivedIDs}
        setShowNumGoods={setShowNumGoods}
        setData={setData}
        setIsFind={setIsFind}
      />
      {allReceivedIDs && showNumGoods && filter !== null && (
        <div>найдено товаров: {allReceivedIDs.length}</div>
      )}
      <h2>Список товаров</h2>
      <ProductItem items={items} isFind={isFind} />
      <Pagination
        allReceivedIDs={allReceivedIDs}
        onPageChangeNext={onPageChangeNext}
        setData={setData}
      />
    </div>
  );
};
