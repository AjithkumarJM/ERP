import axios from 'axios';
import { ROOT_URL, userInfo } from '../const';
import cookie from 'react-cookies';

const interceptor = error => {
    if (error.response.status === 400) {
        cookie.remove('session', { path: '/' });
        window.location.href = '/';
    }
}

function API_CALL(method, url, data, type, callback, file) {
    console.log("Calling API for the method of " + method + " : " + ROOT_URL + url);

    let headers = {};
    if (userInfo) {
        const { token } = userInfo;
        headers['access-token'] = token;
    }

    if (callback) {
        axios({
            method,
            url: ROOT_URL + url,
            data,
            headers,
            responseType: file ? 'arraybuffer' : 'json',
        }).then(data => callback(data)).catch(error => {
            interceptor(error)
            callback(error.response)
        })
    } else {
        return dispatch => {
            dispatch({ type: type.REQ })
            axios({
                method,
                url: ROOT_URL + url,
                data,
                headers,
                responseType: file ? 'arraybuffer' : 'json',
            }).then(response => dispatch({ type: type.RES, payload: response })).catch(error => {
                interceptor(error)
                dispatch({ type: type.FAIL, payload: error })
            })
        }
    }
}

export default API_CALL;