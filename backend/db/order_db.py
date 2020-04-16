import hmac

import psycopg2

from model.dbconfig import DbConfig


class order_DB:
    def __init__(self, dbConfig=DbConfig):
        self.__conn = psycopg2.connect(dbConfig.config())

    def __query(self, query, params=[]):
        c = self.__conn.cursor()
        try:
            c.execute(query, params)
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        
        c.close()
        print(rows)
        return rows if len(rows) else None

    def __update(self, update, params):
        c = self.__conn.cursor()
        try:
            # This might be different, depending on your table and column name
            c.execute(update, params)
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return False

        c.close()
        self.__conn.commit()
        return True

    def __insert(self, insert, params):
        c = self.__conn.cursor()

        try:
            c.execute(insert, params)
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            raise e

        c.close()
        self.__conn.commit()

    def __delete(self, delete, params=[]):
        c = self.__conn.cursor()
        try:
            c.execute(delete, params)
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return False

        c.close()
        self.__conn.commit()
        return True




    def get_ordered_items_customer(self, order_id):
        rows = self.__query("""SELECT io.id as item_order_id, io.order_id, i.name, i.id as item_id, io.quantity,
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

    def get_order_status(self, order_id):
        rows = self.__query('SELECT bill_request FROM "order" o WHERE o.id = %s', [order_id])

        if (not rows):
            return False
        
        return rows[0][0]

    def get_table_id(self, order_id):
        rows = self.__query(
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



    def insert_order(self, table_id):
        self.__insert('INSERT INTO "order" (table_id) VALUES (%s);', [table_id,])
        order_id = self.__query('SELECT id FROM "order" ORDER BY id DESC LIMIT %s', [1,])[0][0]
        
        return order_id  

    def insert_item_order(self, order_id, item_id, quantity, comment):
        self.__insert("INSERT INTO item_order (item_id, order_id, quantity, status_id, comment) VALUES (%s, %s, %s, %s, %s);", [item_id, order_id, quantity, 1, comment])
        return True


    def add_order(self, order_id, item_id, quantity, comment):
        io_id = self.__query("INSERT INTO item_order (item_id, order_id, quantity, status_id, comment) VALUES (%s, %s, %s, %s, %s) RETURNING id;", [item_id, order_id, quantity, 1, comment])

        if (not io_id):
            return None

        return io_id[0][0]


    def modify_item_order(self, item_order_id, comment, quantity):
        new_quantity = quantity
        return self.__update("UPDATE item_order SET quantity = %s, status_id = 1, comment = %s WHERE id = %s", [new_quantity, comment, item_order_id])


    def get_table_id(self, order_id):
        rows = self.__query(
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

    def delete_item_order(self, item_order_id):
        return self.__delete("DELETE FROM item_order WHERE id = %s", [item_order_id,])


    def get_orderId(self, item_id):
        rows = self.__query(
            'SELECT order_id FROM "item_order" WHERE id = %s',
            [item_id]
        )

        if (not rows or not rows[0]):
            return None

        return rows[0][0]


    def get_item_order_status(self, item_order_id):
        status = self.__query('SELECT status_id FROM item_order WHERE id = %s', [item_order_id,])

        if (not status):
            return None

        return status[0][0]


    def update_item_ordered_status(self, id, status):
        return self.__update("UPDATE item_order SET status_id = %s WHERE id = %s", [status, id])



    def get_ordered_items(self, order_id):
        rows = self.__query(
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


    def get_order_list(self, status):
        rows = self.__query(
            """
            SELECT item.name, io.quantity, item.price, io.id, io.status_id, o.table_id, io.comment
            FROM item_order io JOIN item ON (io.item_id = item.id)
                               JOIN "order" o ON (o.id = io.order_id)
            WHERE io.status_id = %s
            ORDER BY io.id
            """,
            [status])

        if (not rows):
            return None

        orders = [{
            'itemName': row[0],
            'quantity': row[1],
            'price': row[2],
            'id': row[3],
            'status_id': row[4],
            'table': row[5],
            'comment': row[6]
        } for row in rows]

        return orders


    def get_order_time(self, order_id):

        # Calculate estimated order time
        # Assume time taken is the sum of cooking time of each item,
        # ignoring quantity, assuming the kitchen staff cooks same items all at the same time.
        print('Getting time')
        rows = self.__query('SELECT io.quantity, i.time FROM "order" o, item i, item_order io WHERE o.id = io.order_id AND io.item_id = i.id AND o.id = %s', [order_id])
        
        if (not rows):
            return None

        total_time = 0
        time = 0
        for row in rows:
            time = row[1]
            total_time = total_time + time

        print(total_time)

        return total_time
