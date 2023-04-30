async function get(url = '') {
  return await fetch(url, {
    method: 'GET',
  })
    .then((response) => response.json())
    .catch((error) => window.alert(error.toString()));
}

async function post(url = '', data = {}) {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => window.alert(error.toString()));
}

async function put(url = '', data = {}) {
  return await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => window.alert(error.toString()));
}

async function del(url = '', data = {}) {
  return await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => window.alert(error.toString()));
}

export { get, post, put, del };
