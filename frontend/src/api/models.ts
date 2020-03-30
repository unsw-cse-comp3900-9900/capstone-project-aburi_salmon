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
  item_id: number,
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
  total_bill: number
}

export type TableInfo = {
  table: number,
  order_id: number,
  items: Array<OrderedItems>,
  total_cost: number,
}


export type OrderedItems = {
  name: string,
  quantity: number,
  price: number,

}

export type AssistanceTable = {
  table_id: number,
  occupied: boolean,
}

export type AssistanceTables = {
  table: Array<AssistanceTable>
}