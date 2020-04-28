class table_DB:

    def __init__(self, db):
        self.db = db

    # Get a list of tables, ordered by table id
    def get_tables(self):
        rows = self.db.query('SELECT id, state FROM public.table ORDER BY id')

        if (not rows):
            return None

        tables = [{
            'table_id': row[0],
            'occupied': row[1]
        } for row in rows]

        return tables

    # Create a table
    def create_table(self, id):
        self.db.insert(
            'INSERT INTO "table" (id, state) VALUES (%s, %s)',
            [id, False]
        )
        return True


    # Delete a table from the database
    def delete_table(self):
        return self.db.delete('DELETE FROM "table" WHERE id = (SELECT max(id) FROM "table")')


    # Get an order ID, given a table ID
    def get_order_id(self, table_id):
        rows = self.db.query(
            'SELECT max(o.id) FROM "order" o JOIN "table" t on (o.table_id = t.id) WHERE o.table_id = %s',
            [table_id]
        )

        if (not rows or not rows[0]):
            return None

        return rows[0][0]

    # Get the order ID of an item
    def get_ordered_items(self, order_id):
        rows = self.db.query(
            'SELECT i.name, io.quantity, i.price, io.id, io.status_id FROM "order" o JOIN item_order io on (o.id = io.order_id) JOIN item i on (i.id = io.item_id) WHERE o.id = %s',
            [order_id]
        )

        if (not rows):
            return []

        orders = [{
            'itemName': row[0],
            'quantity': row[1],
            'price': row[2],
            'id': row[3],
            'status_id': row[4]
        } for row in rows]
        
        return orders

    # Get a list of ordered items from a customer
    def get_ordered_items_customer(self, order_id):
        rows = self.db.query("""SELECT io.id as item_order_id, io.order_id, i.name, i.id as item_id, io.quantity,
        i.price, s.id as status_id, s.status_name, io.comment
        FROM item_order io, item i, status s, "order" o
        WHERE s.id = io.status_id
        AND i.id = io.item_id
        AND io.order_id = o.id
        AND o.id = %s;""", [order_id])

        if (not rows):
            return []

        item_order = []
        for row in rows:
            myDict = {
                'id': row[0],
                'order_id': row[1],
                'item': row[2],
                'item_id': row[3],
                'quantity': row[4],
                'price': row[5],
                'comment': row[8],
                'status': {
                    'id': row[6],
                    'name': row[7]
                }
            }
            item_order.append(myDict)

        return item_order


    # Set a table to be free, given an ID
    def set_table_free(self, id):
        return self.db.update('UPDATE "table" SET state = %s WHERE id = %s', [False, id])


    # Get assistance provided a specific table
    def get_assistance_tables(self):
        rows = self.db.query(
            """
            SELECT distinct t.id, t.state 
            FROM "table" t JOIN "order" o on (t.id = o.table_id)
            WHERE o.assistance = True AND t.state = True AND o.id = (SELECT max(o1.id) FROM "table" t1 JOIN "order" o1 ON (t1.id = o1.table_id) WHERE t.id = t1.id)
            """
        )

        if (not rows or not rows[0]):
            return []

        return [{
            'table_id': row[0],
            'occupied': row[1]
        } for row in rows]


    # Get the table ID provided the order ID
    def get_table_id(self, order_id):
        rows = self.db.query(
            '''
            SELECT o.table_id FROM "order" o WHERE o.id = %s
            ''',
            [order_id]
        )

        print('Getting table id')
        print(rows)

        if (not rows or not rows[0]):
            return None

        return rows[0][0]


    # Set assistance required to a certain status
    def set_assistance(self, table_id, assistance):
        return self.db.update('UPDATE "order" SET assistance = %s WHERE table_id = %s', [assistance, table_id])


    # Pay for a table, provided a status
    def get_paid_tables(self):
        rows = self.db.query(
            'SELECT distinct t.id, t.state FROM "table" t JOIN "order" o on (t.id = o.table_id) WHERE o.paid = True AND t.state = True'
        )

        if (not rows or not rows[0]):
            return []

        return [row[0] for row in rows]


    # Set a table as paid, provided a certain status
    def set_paid(self, table_id, paid):
        return self.db.update('UPDATE "order" SET paid = %s WHERE table_id = %s', [paid, table_id])


    # Get a bill from a table
    def get_bill_tables(self):
        rows = self.db.query(
            """
            SELECT distinct t.id, t.state
            FROM "table" t JOIN "order" o on (t.id = o.table_id)
            WHERE o.bill_request = True AND t.state = True AND 
                o.id = (SELECT max(o1.id) FROM "table" t1 JOIN "order" o1 ON (t1.id = o1.table_id) WHERE t.id = t1.id)
            """
        )

        if (not rows or not rows[0]):
            return []

        return [row[0] for row in rows]


    # Set the bill for a table to a certain amount
    def set_bill(self, table_id, bill):
        return self.db.update('UPDATE "order" SET bill_request = %s WHERE table_id = %s', [bill, table_id])

