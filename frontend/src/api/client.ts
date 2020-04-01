import { Tables, Menu, ItemList, Order, Item, ItemQuantityPair, CreateOrder, ResponseMessage, AddItemToOrderResponseMessage, OrderItemQuantityPair, ItemOrder, TableInfo, AssistanceTables } from "./models";

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

  async createOrder(itemList: Array<ItemQuantityPair>) {
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

  async patchItemOrder(item: OrderItemQuantityPair){
    try {
      // In order to avoid CORS issue, headers, credentials, and mode should be specified
      const r: Response = await fetch(apiUrl + '/order/item', {
        method: 'PATCH',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
      });

      const j: ResponseMessage = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteItemOrder(id: number) {
    try {
      // In order to avoid CORS issue, headers, credentials, and mode should be specified
      const r: Response = await fetch(apiUrl + '/order/item', {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        }),
      });

      const j: ResponseMessage = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async addItemToOrder(item: ItemQuantityPair) {
    try {
      // In order to avoid CORS issue, headers, credentials, and mode should be specified
      const r: Response = await fetch(apiUrl + '/order/item', {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
      });

      const j: AddItemToOrderResponseMessage = await r.json();

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
      const r: Response = await fetch(apiUrl + '/order/status/' + listStatus, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: ItemList = await r.json();
      return j;

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getTableOrders(tablenumber: number) {
    try {
      const r: Response = await fetch(apiUrl + '/table/orders/' + tablenumber, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: TableInfo = await r.json();
      return j;

    } catch (e) {
      console.error(e);
      return null;
    }
  }


  async getAssistanceTable() {
    try {
      const r: Response = await fetch(apiUrl + '/table/assistance', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: AssistanceTables = await r.json();
      return j;

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async freeTable(tableNum: number) {
    
      return fetch(apiUrl + '/table/free/'+ tableNum, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
      });
   }

   async assistance(order_id: number, assistance: boolean){

    return fetch(apiUrl + '/table/assistance', {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          order: order_id,
          assistance: assistance,
        }
      ),
    });
   
   }

   async updateOrderStatus(itemId: number, newStatus: number){
     return fetch(apiUrl + '/order/item/status/' + itemId, {
       method: 'PUT',
       credentials: 'include',
       mode: 'cors',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(
         {
           status: newStatus,
         }
       ),
     });
   }

}
