'use strict';

const axios = require('axios').default;

class TerrAvion {

    constructor(options) {
        this.accessToken = options.accessToken || options.access_token || '';
        this.debug = options.debug || false;
        this.host = options.host || 'https://api2.terravion.com';
    }

    _buildApiUrl = (endpoint) => {
        if (endpoint.substring(0, 1) !== '/') {
            endpoint = '/' + endpoint;
        }
        return this.host + endpoint;
    };

    /**
     * Makes a GET request to the TerrAvion API.
     * @param {String} endpoint       API endpoint
     * @param {Object} [params]       the URL parameters to be sent with the request
     * @param {String} [accessToken]  TerrAvion Access Token
     * @returns {Promise}
     * @private
     */
    _httpGet = (endpoint, params, accessToken) => {
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
    _http = (config) => {
        config = config || {};
        config.params.access_token = (this.accessToken ? this.accessToken : (config.accessToken ? config.accessToken : null));
        return axios.request(config)
            .then((response) => {
                if (!this._isResponseSuccessful(response)) {
                    const err = new Error(`${ response.status } - ${ config.url } failed`);
                    err.code = response.status;
                    err.meta = response.data;
                    throw err;
                }
                return response.data;
            })
    };

    _isResponseSuccessful = (response) => {
        return ((response.status >= 200) && (response.status < 300));
    };

    /**
     * TaUser.getUserId
     * @returns {Promise}
     */
    getUserId = async () => {
        const endpoint = '/users/getUserId';
        return this._httpGet(endpoint);
    };

}

module.exports = TerrAvion;
