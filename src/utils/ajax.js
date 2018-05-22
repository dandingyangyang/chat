import request from 'superagent';

const checkData = response => {
    if (response.ok) {
        const result = response.body;
        if (result.err_no !== 0) {
            alert(result.err_tip);
            return Promise.reject(result.err_tip);
        }
        return Promise.resolve(result.data);
    }
};

const errorCatch = err => {
    alert();
    return Promise.reject();
};

export const get = (url, data = null) => {
    return request
        .get(url)
        .query(data)
        .then(checkData, errorCatch);
};

export const post = (url, data = null) => {
    return request
        .post(url)
        .send(data)
        .then(checkData, errorCatch);
};
