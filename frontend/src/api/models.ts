export type ResponseMessage = {
  status: string,
}

export interface AddItemToOrderResponseMessage extends ResponseMessage {
  id: number; 
}

export type Table = {
  occupied: boolean,
  table_id: number
}

export type Tables = {
  tables: Array<Table>
}

export type Ingredient = {
  id: number,
  name: string,
}

export type Item = {
  id: number,
  name: string,
  description: string,
  ingredients: Array<Ingredient>,
  price: number,
  visible: boolean,
}

export type Categories = {
  id: number,
  name: string,
  position: number,
  items: Array<Item>
}

export type Menu = {
  menu: Array<Categories>
}

export type ListItem = {
  itemName: string,
  quantity: number,
  price: number,
  id: number,
  status_id: number,
  table: number,
}

export type ItemList = {
  itemList: Array<ListItem>
}

export type Status = {
  id: number,
  name: string
}

export type ItemOrder = {
  id: number,
  order_id: number,
  item: string,
  item_id: number,
  quantity: number,
  price: number,
  status: Status
}

export type Order = {
  item_order: Array<ItemOrder>,
  total_bill: number,
}

export type ItemQuantityPair = {
  item_id: number,
  quantity: number,
}

export type OrderItemQuantityPair = {
  id: number,
  quantity: number,
}

export type CreateOrder = {
  order: Array<ItemQuantityPair>,
}

export type TableInfo = {
  table: number,
  order_id: number,
  items: Array<OrderedItems>,
  total_cost: number,
}


export type OrderedItems = {
  itemName: string,
  quantity: number,
  price: number,
  status_id: number,

}

export type AssistanceTable = {
  table_id: number,
  occupied: boolean,
}

export type AssistanceTables = {
  tables: Array<AssistanceTable>
}

export type StaffInfo = {
  id: number,
  name: string,
  username: string,
  staff_type: string,
}

export type AllStaff = {
  staff_list: Array<StaffInfo>,
}

export type ItemStats = {
  id: number,
  name: string,
  price: number,
  orders: number,
  revenue: number,
}

export type AllItemStats = {
    item_sales: Array<ItemStats>,
    total_revenue: number,
}

export type ItemId = {
  item_id: number,
}

export type IngredientList = {
  ingredients: Array<Ingredient>
}