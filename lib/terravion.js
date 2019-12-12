'use strict';

const axios = require('axios').default;

function TerrAvion(environment, options) {
    options = options || {};
    this.name = 'terrAvion';
    this.accessToken = options.accessToken || '';
    this.debug = options.debug || false;
}

/**
 * Makes a GET request to the TerrAvion API.
 * @param {String} endpoint       API endpoint
 * @param {Object} [params]       the URL parameters to be sent with the request
 * @param {String} [accessToken]  TerrAvion Access Token
 * @returns {Promise}
 * @private
 */
TerrAvion.prototype._get = (endpoint, params, accessToken) => {
    const config = {
        method: 'get',
        url: this._buildApiUrl(endpoint),
        params: params || {},
        accessToken: accessToken
    };
    return this._http(config);
};

/**
 * HTTP request to TerrAvion API.  Automatically adds Access Token.
 * @param {Object} config   Axios library config
 * @returns {Promise}
 * @private
 */
TerrAvion.prototype._http = (config) => {
    config = config || {};
    config.params.accessToken = (this.accessToken ? this.accessToken : (config.accessToken ? config.accessToken : null));
    return axios.request(config)
        .then((response) => {
            if (!isResponseSuccessful(response)) {
                const err = new Error(`${ response.status } - ${ config.url } failed`);
                err.code = response.status;
                err.meta = response.body;
                return Promise.reject(err);
            }
            return response.body;
        })
};

/**
 * TaUser.getUserId
 * @returns {Promise}
 */
TerrAvion.prototype.getUserId = () => {
    const endpoint = '/users/getUserId';
    return this._get(endpoint);
};

module.exports = TerrAvion;
