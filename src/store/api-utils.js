import __axios from 'axios';

export async function throwOnError(result) {
  try {
    return (await result).data;
  } catch (err) {
    let error = new Error();
    if (err.response)
      Object.assign(error, err.response.data);
    else {
      error.code = 0;
      error.type = 'EREQUEST';
      error.message = 'Request error'
    }
    throw error;
  }
}

let _axios = __axios.create({
  baseURL: window.origin,
});

export function axios() {
  return _axios;
}

export function setAxios(options) {
  _axios = __axios.create(options);
}
