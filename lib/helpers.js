'use strict'

const querystring = require('querystring')
const url = require('url')

module.exports = function (APIWrapper) {
  /**
   * Add a Mongo query expression to the save query
   *
   * @param {String} field
   * @param {String} operator
   * @param {String} value
   * @return undefined
   * @api private
   */
  APIWrapper.prototype._addToQuery = function (field, operator, value) {
    if (this.query === undefined) {
      this.query = {}
    }

    if (this.query[field] === undefined) {
      this.query[field] = {}
    }

    if (value === undefined) {
      this.query[field] = operator
    } else {
      this.query[field][operator] = value
    }
  }

  /**
   * Build an API URL
   *
   * @param {Object} options
   * @return String
   * @api private
   */
  APIWrapper.prototype._buildURL = function (options) {
    options = options || {}

    let url = ''

    url += this.options.uri
    url += ':' + this.options.port

    if (this.mediaBucket) {
      url += '/media' + (typeof this.mediaBucket === 'string' ? '/' + this.mediaBucket : '')
    } else if (!this.collection && !this.endpoint) {
      url += '/api'
    } else {
      url += '/' + ((this.customVersion !== undefined) ? this.customVersion : this.options.version)

      if (this.collection) {
        url += '/' + ((this.customDatabase !== undefined) ? this.customDatabase : this.options.database)
        url += '/' + this.collection
      } else {
        url += '/' + this.endpoint
      }
    }

    if (options.signUrl) {
      url += '/sign'
    }

    if (options.config) {
      url += '/config'
    }

    if (options.status) {
      url += '/status'
    }

    if (options.collections) {
      url += '/collections'
    }

    if (options.stats) {
      url += '/stats'
    }

    if (this.count) {
      url += '/count'
    }

    if (options.useParams) {
      let params = {}

      if (this.query) {
        params.filter = JSON.stringify(this.query)
      }

      if (this.fields) {
        params.fields = this.fields
      }

      if (!isNaN(parseInt(this.limit))) {
        params.count = this.limit
      }

      if (this.page) {
        params.page = this.page
      }

      if (this.hasOwnProperty('compose')) {
        params.compose = this.compose
      }

      if (typeof this.history !== 'undefined') {
        params.includeHistory = this.history
      }

      if (this.sort) {
        params.sort = JSON.stringify(this.sort)
      }

      const paramsStr = decodeURIComponent(querystring.stringify(params))

      if (paramsStr) {
        url += '?' + paramsStr
      }
    }

    if (options.id) {
      url += '/' + options.id
    }

    return url
  }

  /**
   * Formats a request as an object
   *
   * @param {Object} options - request options
   * @return Object
   * @api private
   */
  APIWrapper.prototype._createRequestObject = function (options) {
    const parsedUri = url.parse(options.uri)
    const requestObject = Object.assign({}, options, {
      uri: {
        href: decodeURIComponent(parsedUri.href),
        hostname: parsedUri.hostname,
        path: decodeURIComponent(parsedUri.path),
        port: parsedUri.port,
        protocol: parsedUri.protocol
      }
    })

    if (typeof this.options.callback === 'function') {
      return this.options.callback(requestObject)
    }

    return requestObject
  }

  /**
   * Logs a message
   *
   * @param {String} message
   * @return undefined
   * @api private
   */
  APIWrapper.prototype._log = function (message) {
    if (console && console.log) {
      console.log(`[DADI API Wrapper] ${message}`)
    }
  }

  /**
   * Clear any saved options and parameters
   *
   * @return undefined
   * @api private
   */
  APIWrapper.prototype._reset = function () {
    this.params = {}
    this.customVersion = undefined
    this.customDatabase = undefined
  }

  /**
   * Strip reserved properties from document object
   *
   * @param {Object} document
   * @return Object
   * @api private
   */
  APIWrapper.prototype._stripReservedProperties = function (document) {
    let sanitisedDocument = {}

    Object.keys(document).forEach(property => {
      if (this.reservedProperties.indexOf(property) === -1) {
        sanitisedDocument[property] = document[property]
      }
    })

    return sanitisedDocument
  }
}
