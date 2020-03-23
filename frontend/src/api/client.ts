import { Tables, Menu, ItemList } from "./models";

const apiUrl = "http://localhost:5000";

export class Client {

  login(username: string, password: string) {
    return fetch(apiUrl + '/auth/login', {
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

  async getTables() {
    try {
      const r: Response = await fetch(apiUrl + '/table', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
      });

      const j: Tables = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getMenu() {
    try {
      const r: Response = await fetch(apiUrl + '/menu', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: Menu = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getListItem(listStatus: number){
    try {
      const r: Response = await fetch(apiUrl + '/kitchen', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        //headers: {
        //  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        //  'Content-Type': 'application/json',
        //  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        //  'Access-Control-Allow-Credentials': 'true',

       // },
        //body: JSON.stringify({
        //  status: listStatus,
        //}),
      });

      const j: ItemList = await r.json();
      return j;

    } catch (e) {
      console.error(e);
      return null;
    }

  }

}
