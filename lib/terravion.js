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

    /**
     * TaUser
     * Find a model instance by {{id}} from the data source.
     * @param userId
     * @returns {Promise}
     */
    getUser = async (userId) => {
        const endpoint = `/users/${ userId }`;
        return this._httpGet(endpoint);
    };

    /**
     * TaUser.prototype.getLayers
     * @param userId
     * @param options
     * @returns {Promise}
     */
    getUserLayers = async (userId, options) => {
        const endpoint = `/users/${ userId }/getLayers`;
        return this._httpGet(endpoint, options);
    };

    /**
     * TaUserBlock
     * get user blocks for map
     * @param userId
     * @param options
     * @returns {Promise}
     */
    getUserBlocksForMap = async (userId, options) => {
        const endpoint = '/userBlocks/getUserBlocksForMap';
        options = options || {};
        options.userId = userId;
        return this._httpGet(endpoint, options);
    };

    /**
     * TaBlock
     * Find a model instance by {{id}} from the data source.
     * @param blockId
     * @param options
     * @returns {Promise}
     */
    getBlock = async (blockId, options) => {
        const endpoint = `/blocks/${ blockId }`;
        return this._httpGet(endpoint, options);
    };

    /**
     * TaBlock.prototype.getGeojson
     * @param blockId
     * @param options
     * @returns {Promise}
     */
    getGeojson = async (blockId, options) => {
        const endpoint = `/blocks/${ blockId }/geom.geojson`;
        return this._httpGet(endpoint, options);
    };

    /**
     * TaLayer
     * get layers by blockId
     * @param userId
     * @param blockId
     * @param options
     * @returns {Promise}
     */
    getLayersFromBlockId = async (userId, blockId, options) => {
        const endpoint = '/layers/getLayersFromBlockId';
        options = options || {};
        options.userId = userId;
        options.blockId = blockId;
        return this._httpGet(endpoint, options);
    }

}

module.exports = TerrAvion;
