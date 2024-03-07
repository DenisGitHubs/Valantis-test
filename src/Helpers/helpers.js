
import { sendRequest } from "../API/api";
  // ф-я для составления сета ID без повторений
export const getNewSet = (newData) => {
    const data = new Set(newData);
    const addNewProduct = [...data];
    return addNewProduct;
}
  // ф-я для получения данных по ID и добавления в стейт для отображения
export const getNames = async (data, setItems) => {
  setItems([])
    const result = await sendRequest('get_items', { ids: data })
    if(result) {
      const uniqueData = result.result.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id));
      setItems(uniqueData)
  }  else getNames(data, setItems)
    }
  // ф-я для сравнения полученных Id на новой странице и проверка в массиве на наличие повторений.
export const removeDuplicates = (data, allReceivedIDs) => {
      return data.filter(item => !allReceivedIDs.includes(item));
    }
  // ф-я для добавления новых ID в массив ID ранее полученных
export const editAllId = (response, setAllReceivedIDs) => {
      setAllReceivedIDs(prevState => {
        const combinedData = [...prevState, ...response];
        return getNewSet(combinedData)
      })
    }  

export const saveIDFilter = async (requestValue, filter, setAllReceivedIDs) => {
  let response = null;
  response = await sendRequest('filter', { [filter]: requestValue });
  if(response) {
    setAllReceivedIDs(response.result)
    return
  } else {
    saveIDFilter(requestValue, filter, setAllReceivedIDs)
  }
}

export const saveCombinedData = (setData, response) => {
  setData(prevState => {
    const combinedData = [...prevState, ...response];
    return getNewSet(combinedData)
  });
}