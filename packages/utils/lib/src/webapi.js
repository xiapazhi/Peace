'use strict';

import request from 'superagent';
import noCache from 'superagent-no-cache';

const rootUrl = '_api';

export const buildUrl = url => {
    const apiurl = `/${rootUrl}/${url}`;
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user == null) {
        return apiurl;
    }
    let connector = url.indexOf('?') === -1 ? '?' : '&';
    return `${apiurl}${connector}token=${user.token}`;
};

export const buildRoute = (url) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user == null) {
        return url
    }
    let connector = url.indexOf('?') === -1 ? '?' : '&';
    return `${url}${connector}token=${user.token}`;
};

const resultHandler =
    (resolve, reject) =>
        (err, res) => {
            if (err) {
                if (err.status == 401) {
                    // 退出到登录页
                    const user = JSON.parse(sessionStorage.getItem('user'));
                    sessionStorage.removeItem('user');
                    if (user.domain) {
                        window.document.location.replace(`/${user.domain}/signin`)
                    } else {
                        window.document.location.replace('/signin');
                    }
                    reject('unauth');
                } else {
                    reject(err);
                }
            } else {
                resolve(res.body);
            }
        };

export class Request {
    static get = (url, query) => new Promise((resolve, reject) => {
        request.get(buildUrl(url)).query(query).use(noCache).end(resultHandler(resolve, reject));
    });

    static post = (url, data, query) => new Promise((resolve, reject) => {
        request.post(buildUrl(url)).query(query).use(noCache).send(data).end(resultHandler(resolve, reject));
    });

    static put = (url, data) => new Promise((resolve, reject) => {
        request.put(buildUrl(url)).send(data).use(noCache).end(resultHandler(resolve, reject));
    });

    static delete = url => new Promise((resolve, reject) => {
        request.delete(buildUrl(url)).use(noCache).end(resultHandler(resolve, reject));
    });
}

export class RouteRequest {
    static get = url => new Promise((resolve, reject) => {
        request.get(buildRoute(url)).end(resultHandler(resolve, reject));
    });

    static post = (url, data) => new Promise((resolve, reject) => {
        request.post(buildRoute(url)).send(data).end(resultHandler(resolve, reject));
    });
}