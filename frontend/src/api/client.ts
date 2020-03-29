import { Tables, Menu, ItemList, Order, Item, ItemQuantityOrderPair, CreateOrder, ResponseMessage } from "./models";

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

  async selectTable(table: number) {
    return fetch(apiUrl + '/auth/customer', {
      method: 'POST',
      body: JSON.stringify({
        table
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

  async getItem(id: number) {
    try {
      const r: Response = await fetch(apiUrl + '/menu/item/' + id.toString(), {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: Item = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createOrder(itemList: Array<ItemQuantityOrderPair>) {
    try {
      const t: CreateOrder = {
        order: itemList
      }

      const r: Response = await fetch(apiUrl + '/order', {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(t),
      });

      const j: ResponseMessage = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async modifyItemOrder(id: number, quantity: number) {
    try {
      const r: Response = await fetch(apiUrl + '/order/edit', {
        method: 'PATCH',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          'id': id,
          'quantity': quantity,
        })
      });

      const j: Item = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getCurrentOrder() {
    try {
      const r: Response = await fetch(apiUrl + '/order', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: Order = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getListItem(listStatus: number){
    try {
      const r: Response = await fetch(apiUrl + '/kitchen/' + listStatus, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        //headers: {
        //  'Content-Type': 'application/json'
        //},
        //body: JSON.stringify({
        //  status: listStatus,
        //  id: 1,
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
