export default class Api {
  static get = async (url) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    });
    const responseBody = await response.json();

    if (response.status !== 200) throw Error(responseBody.message);
    return responseBody;
  }

  static post = async (url, body) => {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    });
    const responseBody = await response.json();

    if (response.status !== 200) throw Error(responseBody.message);
    return responseBody;
  }

  static delete = async (url) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    });
    const responseBody = await response.json();

    if (response.status !== 200) throw Error(responseBody.message);
    return responseBody;
  }
}
