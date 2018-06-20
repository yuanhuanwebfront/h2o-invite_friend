import axios from 'axios';
import querystring from 'querystring';

let $http = {};


// let baseUrl = "http://api.dailyyoga.com/h2oapi/";
let baseUrl = "http://115.29.202.161:8103/h2oapi/";
// let baseUrl = "http://api.dailyyoga.com/h2oapiv2/";

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

$http.$get = function(url, data, notBase){
    let realUrl = notBase ? url : baseUrl + url;

    return axios.get(realUrl, {
        params: data
    })
};

$http.$post = function(url, data, notBase){
    let realUrl = notBase ? url : baseUrl + url;
    return axios.post(realUrl, querystring.stringify(data));
};


export default $http;

