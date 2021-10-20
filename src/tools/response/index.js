const frameworkValidator = require('./framework.validation')

const ResponseBuilder = (Context) => {
  const Builder = {
    Context,
    Request: {
      body: {
        type: '',
        message: '',
        data: {},
      },
      headers: { 'Content-Type': 'application/json' },
      status: 0,
    },
  }

  //Types
  const notification = () => {
    Builder.Request.body.type = 'notification'
    return {
      success: (message = 'ok') => setStatus('success', message, 200),
      error: (message = 'bad request') => setStatus('error', message, 400),
      warning: (message = 'internal server error') =>
        setStatus('warning', message, 500),
      info: (message = 'continue') => setStatus('info', message, 100),
    }
  }
  const alert = () => {
    Builder.Request.body.type = 'alert'
    return {
      success: (message = 'ok') => setStatus('success', message, 200),
      error: (message = 'bad request') => setStatus('error', message, 400),
      warning: (message = 'internal server error') =>
        setStatus('warning', message, 500),
      info: (message = 'continue') => setStatus('info', message, 100),
    }
  }
  const setStatus = (status, message, code) => {
    Builder.Request.body.status = status
    Builder.Request.body.message = message
    Builder.Request.status = code
    return {
      statusCode,
      headers,
      body,
      callback,
      get,
      done,
      code: errCode,
    }
  }
  const errCode = (errCode) => {
    Builder.Request.body.code = errCode
    return {
      statusCode,
      headers,
      body,
      callback,
      get,
      done,
    }
  }

  // Request props
  const body = (data) => {
    Builder.Request.body.data = data
    return {
      statusCode,
      headers,
      json,
      callback,
      get,
      done,
    }
  }
  const headers = (hdrs) => {
    Builder.Request.headers = hdrs
    return {
      body,
      statusCode,
      json,
      callback,
      get,
      done,
    }
  }
  const statusCode = (code) => {
    Builder.Request.status = code
    return {
      body,
      headers,
      json,
      callback,
      get,
      done,
    }
  }

  // Extends
  const json = () => {
    Builder.Request.body = JSON.stringify(Builder.Request.body)
    return {
      statusCode,
      headers,
      callback,
      get,
      done,
    }
  }
  const callback = (work) => {
    work(Builder.Request)
    return {
      get,
      done,
    }
  }

  // Build
  const get = () => {
    return Builder.Request
  }
  const done = () => {
    if (frameworkValidator.isExpress(Builder.Context)) {
      Builder.Context.set(Builder.Request.headers)
        .status(Builder.Request.status)
        .json(Builder.Request.body)
    }
    else if (frameworkValidator.isServerless(Builder.Context)) {
      return {
        statusCode: Builder.Request.status,
        body: JSON.stringify(Builder.Request.body),
        headers: Builder.Request.headers
      }
    }
    else if (frameworkValidator.isAzure(Builder.Context)) {
      Builder.Context.res = Builder.Request
      Builder.Context.done()
    }
    else {
      throw new Error('Framework not recognized')
    }
  }
  return { notification, alert }
}

module.exports = { ResponseBuilder }
