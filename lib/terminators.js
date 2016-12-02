'use strict'

module.exports = function (APIWrapper) {
  /**
   * Apply the callback to the documents affected by the saved
   * query and update them
   *
   * @param {Function} callback
   * @return API
   * @api public
   */
  APIWrapper.prototype.apply = function (callback) {
    if (this.collection === undefined) {
      throw new Error('`apply()` must be used with a collection')
    }

    if (this.query === undefined) {
      throw new Error('Unable to find query for apply')
    }

    if (typeof callback !== 'function') {
      throw new Error('Invalid callback for apply')
    }

    return this._createRequestObject({
      method: 'GET',
      uri: this._buildURL({
        useParams: true
      })
    })
  }

  /**
   * Create one or multiple documents
   *
   * @param {Object} documents
   * @return Promise
   * @api public
   */
  APIWrapper.prototype.create = function (documents) {
    return this._createRequestObject({
      body: documents,
      method: 'POST',
      uri: this._buildURL()
    })
  }

  /**
   * Delete the documents affected by the saved query
   *
   * @return Promise
   * @api public
   */
  APIWrapper.prototype.delete = function () {
    if (this.query === undefined) {
      throw new Error('Unable to find query for delete')
    }

    return this._createRequestObject({
      body: {
        query: this.query
      },
      method: 'DELETE',
      uri: this._buildURL()
    })
  }

  /**
   * Get the documents affected by the saved query
   *
   * @return Promise
   * @api public
   */
  APIWrapper.prototype.find = function (options) {
    if (options && options.extractMetadata) {
      this.count = true
    }

    return this._createRequestObject({
      method: 'GET',
      uri: this._buildURL({
        useParams: true
      })
    })
  }

  /**
   * Get the config for a collection if one is specified, or for main API if not
   *
   * @return Promise
   * @api public
   */
  APIWrapper.prototype.getConfig = function () {
    return this._createRequestObject({
      method: 'GET',
      uri: this._buildURL({config: true})
    })
  }

  /**
   * Get collection stats
   *
   * @return Promise
   * @api public
   */
  APIWrapper.prototype.getStats = function () {
    return this._createRequestObject({
      method: 'GET',
      uri: this._buildURL({stats: true})
    })
  }

  /**
   * Set the config for a collection if one is specified, or for main API if not
   *
   * @param {String} sortField
   * @param {String} sortOrder
   * @return API
   * @api public
   */
  APIWrapper.prototype.setConfig = function (newConfig) {
    return this._createRequestObject({
      body: newConfig,
      method: 'POST',
      uri: this._buildURL({config: true})
    })
  }

  /**
   * Update the documents affect by the saved query
   *
   * @param {Object} update
   * @return Promise
   * @api public
   */
  APIWrapper.prototype.update = function (update) {
    if (this.query === undefined) {
      throw new Error('Unable to find query for update')
    }

    return this._createRequestObject({
      body: {
        query: this.query,
        update: update
      },
      method: 'PUT',
      uri: this._buildURL()
    })
  }
}
