var mockery = require('mockery')
var nock = require('nock')
var path = require('path')
var querystring = require('querystring')
var should = require('should')
var sinon = require('sinon')
var url = require('url')
var _ = require('underscore')

var apiWrapper = require(__dirname + '/../../index')

var wrapper
var field = 'name'
var value = 'John Doe'
var matches = ['John', 'Jane']

var options = {
  uri: 'http://0.0.0.0',
  port: 8000,
  tokenUrl: '/token',
  credentials: {
    clientId: 'test',
    secret: 'secret'
  }
}

var tokenScope
var findScope
var fakeResponse

var documents = [
  { _id: 1, name: 'John' },
  { _id: 2, name: 'Jane' }
]

describe.only('Terminators', function (done) {
  before(function (done) {
    // mockery.enable({
    //   warnOnReplace: false,
    //   warnOnUnregistered: false,
    //   useCleanCache: true
    // })

    // mockery.registerMock('request-promise', function () {
    //   var response = { hello: 'world' }
    //   return Promise.resolve(response.trim())
    // })

    done()
  })

  after(function (done) {
    // mockery.disable()
    // mockery.deregisterAll()
    done()
  })

  beforeEach(function () {
    wrapper = new apiWrapper(options)

    fakeResponse = {
      results: [
        { _id: 1, name: 'John' },
        { _id: 2, name: 'Jane' }
      ],
      metadata: {
        totalCount: 2
      }
    }

    tokenScope = nock(options.uri + ':' + options.port)
      .post(options.tokenUrl)
      .reply(200, {
        accessToken: "d08c2efb-c0d6-446a-ba84-4a4199c9e0c5",
        tokenType: "Bearer",
        expiresIn: 1800
      })
  })

  describe('create', function () {
    it('should create the request object for creating the documents', function (done) {
      var query = { filter: JSON.stringify({ name: 'John' }), page: 33 }
      var expectedQuerystring  = '?' + querystring.stringify(query)

      wrapper.useVersion('1.0')
             .useDatabase('test')
             .in('collectionOne')
             .whereFieldIsEqualTo('name', 'John')
             .goToPage(33)

      var wrapperUrl = wrapper._buildURL({useParams: false})

      var requestObject = wrapper
        .useVersion('1.0')
        .useDatabase('test')
        .in('collectionOne')
        .create(documents)

      requestObject.method.should.eql('POST')
      JSON.stringify(requestObject.body).should.eql(JSON.stringify(documents))
      requestObject.uri.href.should.eql(wrapperUrl)

      done()
    })
  })  

  describe('delete', function () {
    it('should throw an error if no query is specified', function () {
      should.throws(function () {
        return wrapper
        .useVersion('1.0')
        .useDatabase('test')
        .in('collectionOne')
        .delete()
      })
    })

    it('should create the request object for deleting each document from the query', function (done) {
      var query = { query: { name: 'John Doe' } }
      var expectedQuerystring  = '?' + querystring.stringify(query)

      var requestObject = wrapper.useVersion('1.0')
                                 .useDatabase('test')
                                 .in('collectionOne')
                                 .whereFieldIsEqualTo(field, value)
                                 .delete()

      var expectedUrl = wrapper._buildURL({useParams: false})
      
      requestObject.method.should.eql('DELETE')
      JSON.stringify(requestObject.body).should.eql(JSON.stringify(query))
      requestObject.uri.href.should.eql(expectedUrl)

      done()
    })
  })

  describe('update', function () {
    it('should throw an error if no query is specified', function () {
      should.throws(function () {
        return wrapper
        .useVersion('1.0')
        .useDatabase('test')
        .in('collectionOne')
        .update()
      })
    })
  })

  describe('find', function () {
    it('should create the request object for finding documents affected by the query', function (done) {
      var query = { filter: JSON.stringify({ name: 'John' }) }

      var requestObject = wrapper
        .useVersion('1.0')
        .useDatabase('test')
        .in('collectionOne')
        .whereFieldIsEqualTo('name', 'John')
        .find({extractResults: true})

      var expectedUrl = wrapper._buildURL({useParams: true})
      
      requestObject.method.should.eql('GET')
      should.not.exist(requestObject.body)
      requestObject.uri.href.should.eql(expectedUrl)

      done()
    })
  })

  describe('getConfig', function (done) {
    it('should create the request object for getting a collection config', function (done) {
      var query = { filter: JSON.stringify({ name: 'John' }) }

      var requestObject = wrapper
        .useVersion('1.0')
        .useDatabase('test')
        .in('collectionOne')
        .getConfig()

      var expectedUrl = wrapper._buildURL({config: true})
      
      requestObject.method.should.eql('GET')
      should.not.exist(requestObject.body)
      requestObject.uri.href.should.eql(expectedUrl)

      done()
    })
  })

  describe('getStats', function (done) {
    it('should create the request object for getting collection stats', function (done) {
      var query = { filter: JSON.stringify({ name: 'John' }) }

      var requestObject = wrapper
        .useVersion('1.0')
        .useDatabase('test')
        .in('collectionOne')
        .getStats()

      var expectedUrl = wrapper._buildURL({stats: true})
      
      requestObject.method.should.eql('GET')
      should.not.exist(requestObject.body)
      requestObject.uri.href.should.eql(expectedUrl)

      done()
    })
  })
})
