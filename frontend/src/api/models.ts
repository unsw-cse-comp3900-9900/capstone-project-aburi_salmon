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
}

export type ItemList = {
  list: Array<ListItem>
}
