function logError(req, err) {
  const requestInfo = getRequestInfo(req);

  console.error(`${new Date().toISOString()} :: error object:`);
  console.error(JSON.stringify(err, 0, 2)); // error object

  console.error(`${new Date().toISOString()} :: stack trace:`);
  console.error(err); // stack trace

  console.error(`${new Date().toISOString()} :: request info:`);
  console.error(JSON.stringify(requestInfo, 0, 2)); // request info object
}

function getRequestInfo(req) {
  const requestInfo = {
    baseUrl: req.baseUrl,
    body: req.body,
    cookies: req.cookies,
    fresh: req.fresh,
    hostname: req.hostname,
    ip: req.ip,
    ips: req.ips,
    method: req.method,
    originalUrl: req.originalUrl,
    params: req.params,
    path: req.path,
    protocol: req.protocol,
    query: req.query,
    route: req.route,
    secure: req.secure,
    signedCookies: req.signedCookies,
    stale: req.stale,
    subdomains: req.subdomains,
    xhr: req.xhr,
    headers: req.headers,
    vhosts: req.vhost
  };

  return requestInfo;
}

module.exports = {
  getRequestInfo: getRequestInfo,
  logError: logError
};
