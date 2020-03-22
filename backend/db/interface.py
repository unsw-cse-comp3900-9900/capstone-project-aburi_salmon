import hmac

import psycopg2

from model.dbconfig import DbConfig

class DB:
    def __init__(self, dbConfig=DbConfig):
        self.__conn = psycopg2.connect(dbConfig.config())

    def __query(self, query, params):
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
        
    def add_registration_key(self, registration_key, staff_type):
        self.__insert(
            'INSERT INTO staff_registration (registration_key, staff_type, used) VALUES (%s, %s, %s);',
            [registration_key, staff_type, False]
        )
        return True

    def get_registration_keys(self, staff_type):
        if (staff_type):
            keys = self.__query(
                'SELECT * FROM staff_registration WHERE staff_type = %s',
                [staff_type]
            )
        else:
           keys = self.__query('SELECT * FROM staff_registration', [])

        if keys is None:
            return []

        return [
            {
                'key': key[0],
                'active': key[2],
                'staff_type': key[1]
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

    def get_profile(self, username):
        rows = self.__query("SELECT username, name, staff_type_id FROM staff WHERE username = %s;", [username])    
        if (not rows):
            return None

        return dict(
            username=rows[0][0],
            name=rows[0][1],
            staff_type_id=rows[0][2]
        )

    def update_staff(self, username, name, staff_type_id):
        return self.__update("UPDATE staff SET name = %s, staff_type_id = %s WHERE username = %s", [name, staff_type_id, username])

    def get_ordered_items(self):
        rows = self.__query('SELECT * FROM item_order WHERE status_id < %s', [3])

        if (not rows):
            return None

        orders = [{
            'id': row[0],
            'item_id': row[1],
            'order_id': row[2],
            'quantity': row[3],
            'status_id': row[4]
            } for row in rows]
        return orders

    def update_ordered_item_status(self, id, status):
        return self.__update("UPDATE item_order SET status_id = %s WHERE id = %s", [status, id])


    def get_category(self, test):
        rows = self.__query('SELECT * FROM category WHERE position > %s', [test,])

        if (not rows):
            return None

        category = [{
            'id': row[0],
            'name': row[1]
            } for row in rows]
        return category
    
    def get_item(self, test):
        rows = self.__query('SELECT * FROM item WHERE price > %s', [test,])

        if (not rows):
            return None

        category = [{
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price': row[3]
            } for row in rows]
        return category
    
    def get_ingredient(self, test):
        rows = self.__query('SELECT * FROM ingredient WHERE id > %s', [test,])

        if (not rows):
            return None

        category = [{
            'id': row[0],
            'name': row[1]
            } for row in rows]
        return category


    def get_ingredient_from_item(self, test):
        rows = self.__query('SELECT ing.name FROM item_ingredient ii, ingredient ing, item i WHERE ii.ingredient_id = ing.id AND i.name = %s AND ii.item_id = i.id GROUP BY ing.id', [test,])

        if (not rows):
            return None

        ingredient = []
        for row in rows:
            ingredient.append(row[0])
        return ingredient


    def get_item_from_category(self, test):
        rows = self.__query('SELECT i.id, i.name, i.description FROM category_item ci, category c, item i WHERE ci.category_id = c.id AND c.name = %s AND ci.item_id = i.id GROUP BY i.id', [test,])

        if (not rows):
            return None

        #ing = get_ingredient_from_item()

        item = [{
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'ingredient': DB.get_ingredient_from_item(self, row[1])
            } for row in rows]
        return item


    def get_ordered_items_customer(self):
        rows = self.__query('SELECT io.order_id, i.name, io.quantity, s.status_name FROM item_order io, item i, status s WHERE s.id = io.status_id AND i.id = io.item_id AND s.id > %s', [0])

        if (not rows):
            return None

        orders = [{
            'order_id': row[0],
            'item': row[1],
            'quantity': row[2],
            'status_id': row[3]
            } for row in rows]
        return orders

    def get_ordered_items_status(self, item_name):
        status = self.__query('SELECT s.status_name FROM item_order io, item i, status s WHERE s.id = io.status_id AND i.id = io.item_id AND i.name = %s', item_name)

        if (not rows):
            return None

        return status
        
    #    orders = [{
    #        'order_id': row[0],
    #        'item': row[1],
    #        'quantity': row[2],
    #        'status_id': row[3]
    #        } for row in rows]
    #    return orders

    def get_tables(self, test):
        rows = self.__query('SELECT id, state FROM public.table WHERE id > %s ORDER BY id', [test,])

        if (not rows):
            return None

        tables = [{
            'table_id': row[0],
            'occupied': row[1]
        } for row in rows]

        return tables

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
        rows = self.__query("SELECT state FROM public.table WHERE id = %s;", [table_id])

        # 1 means the table is unavailable 
        if (rows == True):
            print('table is taken!')
            return False
        else:
            self.__update("UPDATE public.table SET state = True WHERE id = %s", [id])
            return True


