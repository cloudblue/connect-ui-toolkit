import query from './query';

describe('query', () => {
  let response;
  let $query;
  let url;
  let requestConfig;
  let config;

  beforeEach(() => {
    response = {
      ok: true,
      clone: jest.fn(() => response),
      json: jest.fn().mockResolvedValue({ foo: 'bar' }),
      text: jest.fn(),
    };

    config = {
      api: 'api_endpoint',
      token: 'ABC123',
    };

    global.fetch = jest.fn().mockResolvedValue(response);

    $query = async (method, path, conf) => {
      const res = await query(method, path, { ...config, ...conf });
      url = fetch.mock.calls[0][0];
      requestConfig = fetch.mock.calls[0][1];

      return res;
    };
  });

  it('should set config to empty object by default', async () => {
    await query('GET', 'test/path');

    expect(Object.keys(fetch.mock.calls[0][1])).toEqual(['method', 'headers']);
  });

  it('should set proper headers', async () => {
    await $query('GET', 'test/path', { headers: { test: 123 } });

    expect(requestConfig.headers).toEqual({
      test: 123,
      'Content-Type': 'application/json',
      'Authorization': 'ABC123',
    });
  });

  it.each([
    ['POST', undefined, false],
    ['GET', undefined, false],
    ['GET', { foo: 'bar' }, false],
    ['PUT', { foo: 'bar' }, true],
    ['PATCH', 'BODY', true],
  ])('For %j and body %j should prepare body: %j', async (method, body, result) => {
    await $query(method, 'test/path', { body });

    if (!result) {
      expect(requestConfig.body).not.toBeDefined();
    } else if (typeof body === 'string') {
      expect(requestConfig.body).toBe(body);
    } else {
      expect(requestConfig.body).toBe(JSON.stringify(body));
    }
  });

  it('should use correct url', async () => {
    await $query('GET', 'test/path');
    expect(url).toEqual('api_endpoint/test/path');
  });

  it('should clone response while detting readable json', async () => {
    await $query('GET', 'test/path');
    expect(response.clone).toHaveBeenCalled();
  });

  it('should call #json() for radable responce', async () => {
    await $query('GET', 'test/path');
    expect(response.clone).toHaveBeenCalled();
  });

  it('should call response.text when error occured', async () => {
    response.json.mockRejectedValueOnce('ERROR');
    await $query('GET', 'test/path');
    expect(response.text).toHaveBeenCalled();
  });

  it('should parse responce when marked as non-ok and data is JSON', async () => {
    let error;

    response.ok = false;
    response.status = 403;
    response.json.mockResolvedValueOnce('{ "foo": "bar" }');

    try {
      await $query('GET', 'test/path');
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new Error(
      { foo: 'bar' },
      response,
      `Server responded with non-ok code: 403`,
    ));
  });

  it('should return direct response when marked as non-ok and data is string', async () => {
    let error;

    response.ok = false;
    response.status = 403;
    response.json.mockResolvedValueOnce('FOO');

    try {
      await $query('GET', 'test/path');
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(new Error(
      'FOO',
      response,
      `Server responded with non-ok code: 403`,
    ));
  });

  it('should return proper data', async () => {
    const res = await $query('GET', 'test/path');
    expect(res).toEqual({ foo: 'bar' });
  });
});