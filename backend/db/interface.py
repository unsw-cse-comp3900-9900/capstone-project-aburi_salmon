import psycopg2

from model.dbconfig import DbConfig

class DB:
    def __init__(self, dbConfig=DbConfig):
        self.__conn = psycopg2.connect(dbConfig.config())
    
    def query(self, query, params=[]):
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

    def __query(self, query, params=[]):
        return self.query(query, params)

    def __update(self, update, params):
        return self.update(update, params)

    def update(self, update, params):
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
        return self.insert(insert, params)

    def insert(self, insert, params):
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
        return self.delete(delete, params)
    
    def delete(self, delete, params=[]):
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


    def return_number(self, number):
        rows = self.__query("SELECT %s AS example;", [number])
        if (not rows):
            return None
    
        return rows[0][0]


    def get_ordered_items_customer(self, order_id):
        rows = self.__query(
            """
            SELECT io.id as item_order_id, io.order_id, i.name, i.id as item_id, io.quantity,
                i.price, s.id as status_id, s.status_name, io.comment
            FROM item_order io, item i, status s, "order" o
            WHERE s.id = io.status_id AND i.id = io.item_id AND io.order_id = o.id AND o.id = %s;
            """,
            [order_id]
        )

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

    def get_profile(self, username):
        rows = self.__query("SELECT username, name, staff_type_id FROM staff WHERE username = %s;", [username])    
        if (not rows):
            return None

        return dict(
            username=rows[0][0],
            name=rows[0][1],
            staff_type_id=rows[0][2],
        )

    def update_staff(self, username, name, staff_type_id):
        return self.__update("UPDATE staff SET name = %s, staff_type_id = %s WHERE username = %s", [name, staff_type_id, username])

    def update_item_ordered_status(self, id, status):
        return self.__update("UPDATE item_order SET status_id = %s WHERE id = %s", [status, id])

    def get_quantity(self, item_order_id):
        quantity = self.__query('SELECT quantity FROM item_order WHERE id = %s', [item_order_id])

        return quantity[0][0]  

        rows = self.__query('SELECT ing.name FROM item_ingredient ii, ingredient ing, item i WHERE ii.ingredient_id = ing.id AND i.name = %s AND ii.item_id = i.id GROUP BY ing.id', [test,])

        if (not rows):
            return None

        ingredient = []
        for row in rows:
            ingredient.append(row[0])
        return ingredient

    def get_order_status(self, order_id):
        rows = self.__query('SELECT bill_request FROM "order" o WHERE o.id = %s', [order_id])

        if (not rows):
            return False
        
        return rows[0][0]


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

    def insert_item_order(self, order_id, item_id, quantity, comment):
        self.__insert("INSERT INTO item_order (item_id, order_id, quantity, status_id, comment) VALUES (%s, %s, %s, %s, %s);", [item_id, order_id, quantity, 1, comment])
        return True
        
    def get_tables(self):
        rows = self.__query('SELECT id, state FROM public.table ORDER BY id')

        if (not rows):
            return None

        tables = [{
            'table_id': row[0],
            'occupied': row[1]
        } for row in rows]

        return tables

    def create_table(self, id):
        self.__insert(
            'INSERT INTO "table" (id, state) VALUES (%s, %s)',
            [id, False]
        )
        return True

    def delete_table(self):
        return self.__delete('DELETE FROM "table" WHERE id = (SELECT max(id) FROM "table")')

    def set_table_free(self, id):
        return self.__update('UPDATE "table" SET state = %s WHERE id = %s', [False, id])

    def set_assistance(self, table_id, assistance):
        return self.__update('UPDATE "order" SET assistance = %s WHERE table_id = %s', [assistance, table_id])

    def set_paid(self, table_id, paid):
        return self.__update('UPDATE "order" SET paid = %s WHERE table_id = %s', [paid, table_id])

    def set_bill(self, table_id, bill):
        return self.__update('UPDATE "order" SET bill_request = %s WHERE table_id = %s', [bill, table_id])

    def get_assistance_tables(self):
        rows = self.__query(
            'SELECT distinct t.id, t.state FROM "table" t JOIN "order" o on (t.id = o.table_id) WHERE o.assistance = True AND t.state = True'
        )

        if (not rows or not rows[0]):
            return []

        return [{
            'table_id': row[0],
            'occupied': row[1]
        } for row in rows]

    def get_paid_tables(self):
        rows = self.__query(
            'SELECT distinct t.id, t.state FROM "table" t JOIN "order" o on (t.id = o.table_id) WHERE o.paid = True AND t.state = True'
        )

        if (not rows or not rows[0]):
            return []

        return [row[0] for row in rows]
    
    def get_bill_tables(self):
        rows = self.__query(
            'SELECT distinct t.id, t.state FROM "table" t JOIN "order" o on (t.id = o.table_id) WHERE o.bill_request = True AND t.state = True'
        )

        if (not rows or not rows[0]):
            return []

        return [row[0] for row in rows]

    def beginCooking(self, id):
        return self.__update("UPDATE item_order SET status_id = 1 WHERE id = %s", [id])

    def finishCooking(self, id):
        return self.__update("UPDATE item_order SET status_id = 2 WHERE id = %s", [id])


    def isTableAvailable(self, table_id):
        rows = self.__query("SELECT state FROM public.table WHERE id = %s;", [table_id])

        # 1 means the table is unavailable 
        if (rows != 0):
            return False
        else:
            return True

    # Insert a new order into the order table. This is done when a customer selects a table.
    def insert_order(self, table_id):
        rows = self.__insert('INSERT INTO "order" (table_id) VALUES (%s) RETURNING id;', [table_id,])
        if not rows or not rows[0]:
            return None
        
        order_id = rows[0][0]
        return order_id

    def get_order_id(self, table_id):
        rows = self.__query(
            'SELECT max(o.id) FROM "order" o JOIN "table" t on (o.table_id = t.id) WHERE o.table_id = %s AND t.state = %s',
            [table_id, True]
        )

        if (not rows or not rows[0]):
            return None

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


    def get_item_order_status(self, item_order_id):
        status = self.__query('SELECT status_id FROM item_order WHERE id = %s', [item_order_id,])

        if (not status):
            return None

        return status[0][0]

    def add_order(self, order_id, item_id, quantity, comment):
        io_id = self.__query("INSERT INTO item_order (item_id, order_id, quantity, status_id, comment) VALUES (%s, %s, %s, %s, %s) RETURNING id;", [item_id, order_id, quantity, 1, comment])

        if (not io_id):
            return None

        return io_id[0][0]

    def modify_item_order(self, item_order_id, comment, quantity):
        new_quantity = quantity
        return self.__update("UPDATE item_order SET quantity = %s, status_id = 1, comment = %s WHERE id = %s", [new_quantity, comment, item_order_id])

    def delete_item_order(self, item_order_id):
        return self.__delete("DELETE FROM item_order WHERE id = %s", [item_order_id,])

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


    def get_all_staff(self):
        rows = self.__query('SELECT s.id, s.name, s.username, st.title FROM staff s, staff_type st WHERE s.staff_type_id = st.id AND st.id > %s', [0,])

        if (not rows):
            return None


        staff_list = []
        for row in rows:
            myDict = {
                'id': row[0],
                'name': row[1],
                'username': row[2],
                'staff_type': row[3]
            }
            staff_list.append(myDict)


        return staff_list

    def get_staff_detail(self, staff_id):
        row = self.__query('SELECT s.id, s.name, s.username, s.staff_type_id FROM staff s WHERE s.id = %s', [staff_id,])
        print("ROW")
        print(row)
        if (not row):
            return None

        myDict = {
            'id': row[0][0],
            'name': row[0][1],
            'username': row[0][2],
            'staff_type': row[0][3]
        }

        return myDict

    def modify_staff(self, nid, nname, nusername, nstaff_type):
        return self.__update("UPDATE staff SET name = %s, username = %s, staff_type_id = %s WHERE id = %s", [nname, nusername, nstaff_type, nid])

    def delete_staff(self, staff_id):
        return self.__delete("DELETE FROM staff WHERE id = %s", [staff_id,])

    def get_table_number(self, order_id):
        print('finding table number')
        rows = self.__query('SELECT table_id FROM "order" WHERE id = %s', [order_id])
        if (not rows):
            return None
        return rows[0]

    def get_order_number(self, item_id):
        print('finding order number')
        print(item_id)
        rows = self.__query('SELECT order_id FROM "item_order"  WHERE id = %s', [item_id])
        if (not rows):
            print('YEOLO')
            return None
        return rows[0]

    
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


    def get_orderId(self, item_id):
        rows = self.__query(
            'SELECT order_id FROM "item_order" WHERE id = %s',
            [item_id]
        )

        if (not rows or not rows[0]):
            return None

        return rows[0][0]

