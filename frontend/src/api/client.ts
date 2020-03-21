const apiUrl = "http://localhost:5000";

export class Client {

  login(username: string, password: string) {
    return fetch(apiUrl + 'auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });
  }

  loginTable(tableNumber: string) {

  }
}
