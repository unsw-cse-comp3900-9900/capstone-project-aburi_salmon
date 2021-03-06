import { Tables, Menu, ItemList, Order, Item, StaffLogin,  ItemQuantityPair, CreateOrder, ResponseMessage, AddItemToOrderResponseMessage, OrderItemQuantityPair, TableInfo, AssistanceTables, AllStaff, AllItemStats, Ingredient, WholeItemList, StaffInfo, Bill, RecommendationsResult, Time } from "./models";

const apiUrl = "http://localhost:5000";

export class Client {

  async login(username: string, password: string) {
    try{
      const r: Response = await fetch(apiUrl + '/auth/login', {
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

      const m: StaffLogin | null = await r.json();  
      return m;

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async changeRegistrationKey(type: string, key: string) {
    try {
      const r: Response = await fetch(apiUrl + '/auth/registration', {
        method: 'PUT',
        body: JSON.stringify({
          type,
          key,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
      });

      const m: ResponseMessage = await r.json();

      return m;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async selectTable(table: number) {
    try {
      const r: Response = await fetch(apiUrl + '/auth/customer/login', {
        method: 'POST',
        body: JSON.stringify({
          table: table
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
      });

      const m: ResponseMessage = await r.json();

      return m;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async customerLogout() {
    try {
      const r: Response = await fetch(apiUrl + '/auth/customer/logout', {
        method: 'POST',
        credentials: 'include',
        mode: 'cors'
      });

      const m: ResponseMessage = await r.json();

      return m;
    } catch (e) {
      console.error(e);
      return null;
    }
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
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(t),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const j: ResponseMessage = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async patchItemOrder(id: number, quantity: number, comment: string) {
    try {
      // In order to avoid CORS issue, headers, credentials, and mode should be specified
      const p: OrderItemQuantityPair = {
        id: id,
        quantity: quantity,
        comment: comment,
      }

      const r: Response = await fetch(apiUrl + '/order/item', {
        method: 'PATCH',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(p),
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

  async getListItem(listStatus: number) {
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
    try {
      const r: Response = await fetch(apiUrl + '/table/free/' + tableNum, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
    });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async assistance(table: number | null, assistance: boolean) {
    try {
      const r: Response = await fetch(apiUrl + '/table/assistance', {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            assistance: assistance,
            table: table,
          }
        ),
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }

  }

  async requestBill() {
    try {
      const r: Response = await fetch(apiUrl + '/table/bill', {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            bill: true,
          }
        ),
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateOrderStatus(itemId: number, newStatus: number) {
    try {
      const r: Response = await fetch(apiUrl + '/order/item/status/' + itemId, {
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
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }

  }

  async getStaff() {
    try {
      const r: Response = await fetch(apiUrl + '/staff_profile/staff_list', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: AllStaff = await r.json();
      return j;

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteStaff(staff_id: number) {

    try {
      const r: Response = await fetch(apiUrl + '/staff_profile/edit', {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          staff_id: staff_id,
        }
      ),
    });
      const j: number = await r.status;
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }

  }

  async changeStaffType(staff_id: number, name: string, username: string, staff_type_id: number) {

    try {
      const r: Response = await fetch(apiUrl + '/staff_profile/edit', {
      method: 'PATCH',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          staff_id: staff_id,
          name: name,
          username: username,
          staff_type_id: staff_type_id,
        }
      ),
      });
      const j: number = await r.status;
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }

  }

  async getAllStats() {
    try {
      const r: Response = await fetch(apiUrl + '/stats/sales', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: AllItemStats = await r.json();
      return j;

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async addCategory(categoryName: string) {
    try {
      const r: Response = await fetch(apiUrl + '/menu/category', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          name: categoryName,
        }
      ),
    });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async editCategory(categoryName: string, position: number | undefined, id: number | undefined) {
    try {
      const r: Response = await fetch(apiUrl + '/menu/category/' + id, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            name: categoryName,
            position: position,
          }
        ),
    });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }


  async deleteCat(id: number | undefined) {
   
    try {
      const r: Response = await fetch(apiUrl + '/menu/category/' + id, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
      });
      const j = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }

  }
  
  async addItem(name: string, description: string, price: number, visible: boolean, image_url: string) {
    try {
      const r: Response = await fetch(apiUrl + '/menu/item', {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            name: name,
            description: description,
            price: price,
            visible: visible,
            image_url: image_url,
          }
        ),
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
     
  }

  async editItem(name: string, description: string, price: number, visible: boolean, itemId: number, image_url: string) {
    try {
      const r: Response = await fetch(apiUrl + '/menu/item/' + itemId, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            name: name,
            description: description,
            price: price,
            visible: visible,
            image_url: image_url,
          }
        ),
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }

  }

  async deleteItem(id:number | undefined) {
    try {
      const r: Response = await fetch(apiUrl + '/menu/item/' + id, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
    });
    const j: ResponseMessage = await r.json();
    return j;
  } catch(e) {
    console.error(e);
    return null;
  }
    
  }

  async addItemToCat(position: number, catId: number, itemId: number) {
    try {
      const r: Response = await fetch(apiUrl + '/menu/category/' + catId + '/item/' + itemId, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            position: position,
          }
        ),
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async addIngredient(name: string){
    try {
      const r: Response = await fetch(apiUrl + '/menu/ingredient', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          name: name,
        }
      ),
    });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getIngredients(){
    try {
      const r: Response = await fetch(apiUrl + '/menu/ingredient', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: Array<Ingredient> = await r.json();
      return j;

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteIngredient(id: number) {
    try {
      const r: Response = await fetch(apiUrl + '/menu/ingredient/' + id, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
    
  }

  async getAllItems(){
    try {
      const r: Response = await fetch(apiUrl + '/menu/item', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });

      const j: WholeItemList = await r.json();
      return j;

    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async removeItemFromCat(itemId: number | undefined, catId: number | undefined){
    try {
      const r: Response = await fetch(apiUrl + '/menu/category/' + catId + '/item/' + itemId, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      });
      const j: ResponseMessage = await r.json();
      return j;    
    } catch(e) {
      console.error(e);
      return null;
    }
  }

  async removeIngredFromItem(itemId: number, ingredId: number){
    try {
      const r: Response = await fetch(apiUrl + '/menu/item/' + itemId + '/ingredient/' + ingredId,{
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async addIngredToItem(itemId: number, ingredId: number){
    try {
      const r: Response = await fetch(apiUrl + '/menu/item/' + itemId + '/ingredient/' + ingredId, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async catSwitch(cat1Id: number, cat2Id: number | undefined){
    try {
      const r: Response = await fetch(apiUrl + '/menu/category/swap/' + cat1Id + '/' + cat2Id, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      });
      const j: ResponseMessage = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getBill(){
    try {
      const r: Response = await fetch(apiUrl + '/table/bill', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });
      const j: Bill = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getRecommendations(items: Array<Number>) {
    try {
      const r: Response = await fetch(apiUrl + '/stats/recommend', {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            items: items,
          }
        ),
      });
      const j: RecommendationsResult = await r.json();
      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getTime() {
    try {
      const r: Response = await fetch(apiUrl + '/order/time', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
      });

      const j: Time = await r.json();

      return j;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
