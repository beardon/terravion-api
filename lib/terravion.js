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

    /**
     * Makes a GET request to the TerrAvion API.
     * @param {string} endpoint       API endpoint
     * @param {Object} [params]       the URL parameters to be sent with the request
     * @param {string} [accessToken]  TerrAvion Access Token
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

    _isResponseSuccessful = (response) => {
        return ((response.status >= 200) && (response.status < 300));
    };

    /**
     * TaBlock
     * Find a model instance by {{id}} from the data source.
     * @param {string} blockId          Model id
     * @param {Object} options          option set
     * @param {string} [options.filter] Filter
     * @returns {Promise}
     */
    getBlock = async (blockId, options) => {
        const endpoint = `/blocks/${ blockId }`;
        return this._httpGet(endpoint, options);
    };

    /**
     * TaBlock.prototype.getGeojson
     * @param {string} blockId  TaBlock id
     * @returns {Promise}
     */
    getGeojson = async (blockId) => {
        const endpoint = `/blocks/${ blockId }/geom.geojson`;
        return this._httpGet(endpoint, {});
    };

    /**
     * TaLayer
     * get layers by blockId
     * @param {string} userId   userId
     * @param {string} blockId  blockId
     * @returns {Promise}
     */
    getLayersFromBlockId = async (userId, blockId) => {
        const endpoint = '/layers/getLayersFromBlockId';
        const config = {
            userId: userId,
            blockId: blockId,
        };
        return this._httpGet(endpoint, config);
    };

    /**
     * TaUser
     * Find a model instance by {{id}} from the data source.
     * @param {string} userId                       userId, can be found in https://api2.terravion.com/users/getUserId
     * @returns {Promise}
     */
    getUser = async (userId) => {
        const endpoint = `/users/${ userId }`;
        return this._httpGet(endpoint);
    };

    /**
     * TaUserBlock
     * get user blocks for map
     * @param {string} userId                   filter response by userId
     * @param {Object} options                  option set
     * @param {string} [options.season]         filter response by season
     * @param {string} [options.agronomistId]   filter response by agronomistId
     * @param {string} [options.farmerId]       filter response by farmerId
     * @param {string} [options.orderId]        filter response by orderId
     * @param {number} [options.lat]            filter response by lat
     * @param {number} [options.lng]            filter response by lng
     * @param {number} [options.distanceM]      filter response by distanceM
     * @returns {Promise}
     */
    getUserBlocksForMap = async (userId, options) => {
        const endpoint = '/userBlocks/getUserBlocksForMap';
        const config = options || {};
        config.userId = userId;
        return this._httpGet(endpoint, config);
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
     * TaUser.prototype.getLayers
     * @param {string} userId                       userId, can be found in https://api2.terravion.com/users/getUserId
     * @param {Object} options                      option set
     * @param {string} [options.blockId]            blockId [optional]
     * @param {number} [options.epochStart]         start filter on capture epoch date [optional]
     * @param {number} [options.epochEnd]           end filter on capture epoch date [optional]
     * @param {number} [options.addEpochStart]      start filter on add epoch date [optional]
     * @param {number} [options.addEpochEnd]        end filter on add epoch date [optional]
     * @param {number} [options.lat]                filter on lat (lat lng both required) [optional]
     * @param {number} [options.lng]                filter on lat (lat lng both required) [optional]
     * @param {number} [options.year]               Filter results by subscribed year [optional]
     * @param {number} [options.modifyEpochStart]   start filter on add epoch date [optional]
     * @param {number} [options.modifyEpochEnd]     end filter on add epoch date [optional]
     * @param {string} [options.partnerOrderId]     Partner Order ID [optional]
     * @returns {Promise}
     */
    getUserLayers = async (userId, options) => {
        const endpoint = `/users/${ userId }/getLayers`;
        return this._httpGet(endpoint, options);
    };

}

module.exports = TerrAvion;
