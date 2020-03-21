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
            #return None
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
        rows = self.__query("SELECT id FROM staff_registration WHERE registration_key = %s;", [key])
        if (rows == None):
            return False

        return rows[0][0]
        
    def add_registration_key(self, registration_key):
        c = self.__conn.cursor()
        print(registration_key)
        try:
            c.execute("INSERT INTO staff_registration (registration_key) VALUES (%s);", (registration_key,))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            #return None
            raise e

        c.close()
        self.__conn.commit()
        return True

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
        rows = self.__query('SELECT io.order_id, i.name, i.id, io.quantity, i.price, s.status_name FROM item_order io, item i, status s WHERE s.id = io.status_id AND i.id = io.item_id AND s.id > %s', [0])

        if (not rows):
            return None


        item_order = []
        total = 0
        for row in rows:
            myDict = {
                'order_id': row[0],
                'item': row[1],
                'item_id': row[2],
                'quantity': row[3],
                'price': row[4],
                'status_id': row[5]
            }
            item_order.append(myDict)
            total = total + (row[3]*row[4])
        myDict2 = {
            'Total Bill': total
        }
        item_order.append(myDict2)
        return item_order



    def get_ordered_items_status(self, item_name):
        status = self.__query('SELECT s.status_name FROM item_order io, item i, status s WHERE s.id = io.status_id AND i.id = io.item_id AND i.name = %s', item_name)

        if (not rows):
            return None

        return status

    def new_order(self, table_id, item_id, quantity):
        self.__insert('INSERT INTO "order" (table_id) VALUES (%s);', [table_id,])

        order_id_row = self.__query('SELECT id FROM "order" ORDER BY id DESC LIMIT %s', [1,])
        order_id = order_id_row[0]

        self.__insert("INSERT INTO item_order (item_id, order_id, quantity, status_id) VALUES (%s, %s, %s, %s);",
                      [item_id, order_id, quantity, 1])
        
        return True

