const productionDomain = process.env.REACT_APP_PRODUCTION_DOMAIN;
const backendServerIp = process.env.REACT_APP_BACKEND_SERVER_IP;
const backendServicePort = process.env.REACT_APP_BACKEND_SERVICE_PORT;

/**
 * Get the backend URI based on the given environment variables
 *
 * @return {String} Backend URI
 */
export const getBackendUri = () => {
  let uri;
  if (window.location.href.indexOf(productionDomain) >= 0) {
    uri = "https://" + (productionDomain);
  } else if (window.location.href.indexOf(backendServerIp) >= 0) {
    uri = "http://" + (backendServerIp);
  } else {
    uri = "http://127.0.0.1:" + (backendServicePort);
  }
  uri.concat("/");

  return uri;
}


/**
 * Get the GraphQL API URI
 *
 * @returns {String} GraphQL API URI
 */
export const getGraphQLUri = () => getBackendUri() + "/graphql/";
