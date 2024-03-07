
const md5 = require('md5');
const apiUrl = 'https://cors-anywhere.herokuapp.com/http://api.valantis.store:40000/';
const password = 'Valantis';

const generateAuthString = (password) => {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return md5(`${password}_${timestamp}`);
}

export async function sendRequest(action, params) {
    const authString = generateAuthString(password);
    const headers = {
        'X-Auth': authString,
        'Content-Type': 'application/json'
    };

    const body = JSON.stringify({ action, params });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (response.status === 401) {
            throw new Error('Ошибка авторизации');
        }

        const data = await response.json();

        return data
    } catch (error) {
        console.error('Произошла ошибка при выполнении запроса:', error);
        return
    }
}

// sendRequest('get_ids', { offset: 10, limit: 3 });

// // Пример-запрос метода get_items
// sendRequest('get_items', { ids: ['1789ecf3-f81c-4f49-ada2-83804dcc74b0'] });

// // Пример-запрос метода get_fields
// sendRequest('get_fields', { field: 'brand', offset: 3, limit: 5 });

// // Пример-запрос метода filter
// sendRequest('filter', { price: 17500.0 });