const ResponseBuilder = (Context) => {
  const Response = {
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
    Response.Request.body.type = 'notification'
    return {
      success: (message = 'ok') => setStatus('success', message, 200),
      error: (message = 'bad request') => setStatus('error', message, 400),
      warning: (message = 'internal server error') => setStatus('warning', message, 500),
      info: (message = 'continue') => setStatus('info', message, 100),
    }
  }
  const alert = () => {
    Response.Request.body.type = 'alert'
    return {
      success: (message = 'ok') => setStatus('success', message, 200),
      error: (message = 'bad request') => setStatus('error', message, 400),
      warning: (message = 'internal server error') => setStatus('warning', message, 500),
      info: (message = 'continue') => setStatus('info', message, 100),
    }
  }
  const setStatus = (status, message, code) => {
    Response.Request.body.status = status
    Response.Request.body.message = message
    Response.Request.status = code
    return {
      statusCode,
      headers,
      body,
      callback,
      get,
      done,
      code: errCode
    }
  }
  const errCode = (errCode) => {
    Response.Request.body.code = errCode
    return {
      statusCode,
      headers,
      body,
      callback,
      get,
      done
    }
  }

  // Request props
  const body = (data) => {
    Response.Request.body.data = data
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
    Response.Request.headers = hdrs
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
    Response.Request.status = code
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
    Response.Request.body = JSON.stringify(Response.Request.body)
    return {
      statusCode,
      headers,
      callback,
      get,
      done,
    }
  }
  const callback = (work) => {
    work(Response.Request)
    return {
      get,
      done,
    }
  }

  // Build
  const get = () => {
    return Response.Request
  }
  const done = () => {
    Response.Context.res = Response.Request
    Response.Context.done()
  }
  return { notification, alert }
}

module.exports = { ResponseBuilder }
