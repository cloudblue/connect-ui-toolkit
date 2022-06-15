const query = async (method, path, config = {}) => {
  const { headers = {}, body, api, token } = config;

  const requestConfig = {
    method,
    headers,
  };

  requestConfig.headers['Content-Type'] = 'application/json';
  requestConfig.headers['Authorization'] = token;

  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    requestConfig.body = typeof requestConfig.body === 'string'
      ? requestConfig.body
      : JSON.stringify(requestConfig.body);
  }

  const response = await fetch(`${api}/${path}`, requestConfig);
  let responseData;

  try {
    const readableResponse = response.clone();
    responseData = await readableResponse.json();
  } catch (e) {
    responseData = response.text();
  }

  if (!response.ok) {
    let data;

    try {
      data = JSON.parse(responseData);
    } catch (e) {
      data = responseData;
    }

    throw new Error(
      data,
      response,
      `Server responded with non-ok code: ${response.status}`,
    );
  }

  return responseData;
}

export default query;