export type Table = {
  occupied: boolean,
  table_id: number
}

export type Tables = {
  tables: Array<Table>
}

export type Item = {
  id: number,
  name: string,
  description: string,
  ingredient: Array<string>
}

export type Categories = {
  cat: string,
  item: Array<Item>
}

export type Menu = {
  menu: Array<Categories>
}