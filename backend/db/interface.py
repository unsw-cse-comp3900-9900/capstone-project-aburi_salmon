import hmac

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


    # NOTE: Take these functions as example since you might have different implementations
    
    def login(self, username, password):
        rows = self.__query("SELECT password FROM staff WHERE username = %s;", [username])
        if (not rows):
            return False

        # This compares two strings to prevent timing attack
        result = hmac.compare_digest(rows[0][0], password)
        return result

    def validate_key(self, key):
        # Check if valid key
        rows = self.__query("SELECT registration_key, staff_type FROM staff_registration WHERE registration_key = %s AND not used;", [key])
        if (rows == None):
            return False

        # Set used to true
        self.__update("UPDATE staff_registration SET used = %s WHERE registration_key = %s", [True, key])

        return rows[0][1]
        
    def set_registration_key(self, registration_key, staff_type):

        self.__update(
            """
                UPDATE staff_registration
                SET registration_key = %s
                FROM staff_type
                WHERE staff_type.id = staff_registration.staff_type AND staff_type.title = %s;
            """,
            [registration_key, staff_type]
        )
        return True

    def get_registration_keys(self, staff_type):
        if (staff_type):
            keys = self.__query(
                'SELECT registration_key, title, id FROM staff_registration sr JOIN staff_type st ON (sr.staff_type = st.id) WHERE st.id = %s',
                [staff_type]
            )
        else:
           keys = self.__query('SELECT registration_key, title, id FROM staff_registration sr JOIN staff_type st ON (sr.staff_type = st.id)')

        if keys is None:
            return []

        return [
            {
                'key': key[0],
                'staff_name': key[1],
                'staff_id': key[2]
            } for key in keys
        ]

    def register(self, username, password, name, staff_type_id):
        self.__insert("INSERT INTO staff (username, password, name, staff_type_id) VALUES (%s, %s, %s, %s);",
                      [username, password, name, staff_type_id])
        return True

    def available_username(self, username):
        rows = self.__query("SELECT COUNT(*) FROM staff WHERE username = %s;", [username])
        if (not rows):
            return False

        rlen = rows[0][0]
        return (rlen == 0)

    def update_item_ordered_status(self, id, status):
        return self.__update("UPDATE item_order SET status_id = %s WHERE id = %s", [status, id])


    def get_category(self, id):
        rows = self.__query('SELECT * FROM category WHERE id = %s', [id])

        if (not rows or not rows[0]):
            return
        
        category = {
            'id': id,
            'name': rows[0][1],
            'position': rows[0][2],
            'items': self.get_items_by_category(id)
        }

        return category
        
    def create_item(self, item):
        image_url = item.get('image_url')

        if image_url is None:
            image_url = ""

        rows = self.__query(
            'INSERT INTO item (name, description, price, visible, image_url) VALUES (%s, %s, %s, %s, %s) RETURNING id',
            [item.get('name'), item.get('description'), item.get('price'), item.get('visible'), image_url]
        )
        if not rows or not rows[0]:
            return None

        return rows[0][0]

    def get_all_menu_items(self):
        rows = self.__query(
            'SELECT id, name, description, price, visible, image_url FROM item'
        )
        if (not rows):
            return []

        return [{
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3],
            'visible': row[4],
            'image_url': row[5],
            'ingredients': self.get_item_ingredients(row[0])
        } for row in rows]

    def get_item_by_id(self, id):
        rows = self.__query('SELECT id, name, description, price, visible, image_url FROM item WHERE id = %s', [id])
        if (not rows):
            return None
        
        itemRow = rows[0]
        return {
            'id': itemRow[0],
            'name': itemRow[1],
            'description': itemRow[2],
            'price': itemRow[3],
            'visible': itemRow[4],
            'image_url': itemRow[5],
            'ingredients': self.get_item_ingredients(id)
        }

    def get_items_by_category(self, category_id):
        rows = self.__query(
            'SELECT id, name, description, price, visible, image_url FROM item i JOIN category_item ci on (i.id = ci.item_id) WHERE ci.category_id = %s',
            [category_id]
        )

        if (not rows):
            return []
        
        return [{
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3],
            'visible': row[4],
            'image_url': row[5],
            'ingredients': self.get_item_ingredients(row[0])
        } for row in rows]

    def edit_item(self, editStatement, editArr):
        return self.__update(editStatement, editArr)

    def delete_item(self, id):
        return (
            self.__delete('DELETE FROM category_item WHERE item_id = %s', [id]) and
            self.__delete("DELETE FROM item WHERE id = %s", [id])
        )

    def create_category(self, name):
        # Set the postion to the current highest position + 1 
        rows = self.__query('SELECT max(position) FROM category')
        position = rows[0][0] + 1

        self.__insert(
            'INSERT INTO category (name, position) VALUES (%s, %s)',
            [name, position]
        )
        return True

    def get_categories(self):
        rows = self.__query('SELECT * FROM category ORDER BY position')
        if (not rows):
            return None
        
        return [{
            'id': row[0],
            'name': row[1],
            'position': row[2]
        } for row in rows]

    def edit_category(self, editStatement, editArr):
        return self.__update(editStatement, editArr)

    def delete_category(self, id):
        self.__delete('DELETE FROM category_item WHERE category_id = %s', [id])
        return self.__delete('DELETE FROM category WHERE id = %s', [id])

    
    def swapCategoryPositions(self, id1, id2):
        print('Swapping categories {} and {}'.format(id1, id2))
        # Get positions
        rows = self.__query('SELECT position FROM category WHERE id in (%s, %s) ORDER BY id', [id1, id2])
        position1 = rows[0][0]
        position2 = rows[1][0]

        print(position1, position2)
        # Update position 1 and position 2
        return (
            self.__update('UPDATE category SET position = %s WHERE id = %s', [0, id1]) and
            self.__update('UPDATE category SET position = %s WHERE id = %s', [position1, id2]) and
            self.__update('UPDATE category SET position = %s WHERE id = %s', [position2, id1])
        )

    def add_item_to_category(self, category_id, item_id):
        # Check if the item not in category already
        rows = self.__query(
            'SELECT * FROM category_item WHERE category_id = %s AND item_id = %s',
            [category_id, item_id]
        )
        
        if (rows != None):
            # Item already in category
            return False

        # Add item to category
        self.__insert(
            'INSERT INTO category_item (item_id, category_id) VALUES (%s, %s)',
            [item_id, category_id]
        )
        return True

    def remove_item_from_category(self, category_id, item_id):
        return self.__delete(
            'DELETE FROM category_item WHERE category_id = %s AND item_id = %s',
            [category_id, item_id]
        )

    def get_all_ingredients(self):
        rows = self.__query('SELECT * FROM ingredient')
        if (not rows):
            return []
        
        return [{
            'id': row[0],
            'name': row[1]
        } for row in rows]

    def create_ingredient(self, name):
        self.__insert(
            'INSERT INTO ingredient (name) VALUES (%s)',
            [name]
        )
        return True

    def get_ingredient_by_id(self, id):
        rows = self.__query(
            'SELECT * FROM ingredient WHERE id = %s',
            [id]
        )

        if (not rows or not rows[0]):
            return None

        ingredient = rows[0]
        return {
            'id': ingredient[0],
            'name': ingredient[1]
        }

    def get_item_ingredients(self, id):
        rows = self.__query(
            'SELECT * FROM ingredient i JOIN item_ingredient ii on (i.id = ii.ingredient_id) WHERE ii.item_id = %s',
            [id]
        )
        
        if (not rows):
            return []

        return [{
            'id': row[0],
            'name': row[1]
        } for row in rows]

    def edit_ingredient(self, editStatement, editArr):
        self.__update(editStatement, editArr)
        return True

    def delete_ingredient(self, id):
        rows = self.__query(
            'SELECT count(item_id) FROM item_ingredient WHERE ingredient_id = %s',
            [id]
        )

        if (rows[0][0]):
            return False
        
        return self.__delete(
            'DELETE FROM ingredient WHERE id = %s',
            [id]
        )

    def add_ingredient_to_item(self, item_id, ingredient_id):
        self.__insert(
            'INSERT INTO item_ingredient (item_id, ingredient_id) VALUES (%s, %s)',
            [item_id, ingredient_id]
        )

        return True

    def remove_ingredient_from_item(self, item_id, ingredient_id):
        return self.__delete(
            'DELETE FROM item_ingredient WHERE item_id = %s AND ingredient_id = %s',
            [item_id, ingredient_id]
        )

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
      
    def insert_order(self, table_id):
        self.__insert('INSERT INTO "order" (table_id) VALUES (%s);', [table_id,])
        order_id = self.__query('SELECT id FROM "order" ORDER BY id DESC LIMIT %s', [1,])[0][0]
        
        return order_id  

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

    def set_table_free_order_id(self, id):
        return self.__update('UPDATE "table" t SET state = %s WHERE id = (SELECT table_id FROM "order" WHERE id = %s)', [False, id])

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

    def selectTable(self, table_id):
        rows = self.__query('SELECT state FROM "table" WHERE id = %s;', [table_id])

        if (not rows):
            print('Something went wrong')
            return False

        # 1 means the table is unavailable 
        if (rows[0][0]):
            print('table is taken!')
            return False
        else:
            self.__update('UPDATE "table" SET state = %s WHERE id = %s', [True, table_id])
            return True

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

    def get_menu_item_sales(self, item_id = None):
        if item_id is None:
            rows = self.__query(
                'SELECT i.id, i.name, i.price, sum(io.quantity) FROM item i JOIN item_order io on (i.id = io.item_id) GROUP BY i.id'
            )
        else:
            rows = self.__query(
                'SELECT i.id, i.name, i.price, sum(io.quantity) FROM item i JOIN item_order io on (i.id = io.item_id) WHERE i.id = %s GROUP BY i.id',
                [item_id]
            )

        if (not rows):
            return []

        return [{
            'id': row[0],
            'name': row[1],
            'price': row[2],
            'orders': row[3],
            'revenue': row[2] * row[3]
        } for row in rows]

    def get_category_sales(self):
        rows = self.__query(
            '''
            SELECT c.id, c.name, sum(io.quantity), sum(io.quantity * i.price) as revenue
            FROM item i JOIN item_order io on (i.id = io.item_id)
                        JOIN category_item ci on (ci.item_id = i.id)
                        JOIN category c on (c.id = ci.category_id)
            GROUP BY c.id
            '''
        )

        if (not rows):
            return []

        return [{
            'id': row[0],
            'name': row[1],
            'orders': row[2],
            'revenue': row[3]
        } for row in rows]

    def get_recommendation(self, items=[]):
        # Orders where item appears
        rows = self.__query(
            'SELECT distinct o.id FROM item i JOIN item_order io on (i.id = io.item_id) JOIN "order" o on (o.id = io.order_id) WHERE i.id in %s',
            [tuple(i for i in items)]
        )

        if (not rows or not rows[0]):
            return None

        orders = tuple(row[0] for row in rows)

        # Get count of other items in these orders
        rows = self.__query(
            'SELECT distinct i.id, i.name, count(i.id) as seen FROM item i JOIN item_order io on (i.id = io.item_id) JOIN "order" o on (o.id = io.order_id) WHERE i.id not in %s AND o.id in %s GROUP BY i.id ORDER BY seen DESC',
            [tuple(i for i in items), orders]
        )

        # Return top 3 recommendations
        return [{
            'item_id': row[0],
            'name': row[1],
            'count': row[2]
        } for row in rows][:3]


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
