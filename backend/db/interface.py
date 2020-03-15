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

    def return_number(self, number):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT %s AS example;", (number,))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return None

        c.close()
        return rows[0][0]


    # NOTE: Take these functions as example since you might have different implementations
    
    def login(self, username, password):
        rows = self.__query("SELECT password FROM staff WHERE username = %s;", [username])
        if (rows == None):
            return False

        # This compares two strings to prevent timing attack
        result = hmac.compare_digest(rows[0][0], password)
        return result

    def validate_key(self, key):
        c = self.__conn.cursor()

        try:
            # This might be different, depending on your table and column name
            c.execute("SELECT id FROM staff_registration WHERE registration_key = %s;", (key,))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return False

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return False

        c.close()
        return rows[0][0]
        
    def register(self, username, password, name, staff_type_id):
        c = self.__conn.cursor()

        try:
            c.execute("INSERT INTO staff (username, password, name, staff_type_id) VALUES (%s, %s, %s, %s);",
                      (username, password, name, staff_type_id))
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

    def available_username(self, username):
        c = self.__conn.cursor()

        try:
            c.execute("SELECT COUNT(*) FROM staff WHERE username = %s;", (username,))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return None
        rlen = rows[0][0]

        c.close()
        return (rlen == 0)

    def get_profile(self, username):
        c = self.__conn.cursor()

        try:
            # This might be different, depending on your table and column name
            c.execute("SELECT username, name, staff_type_id FROM staff WHERE username = %s;", (username,))
        except Exception as e:
            c.execute("ROLLBACK")
            self.__conn.commit()
            print(e)
            c.close()
            return None

        rows = c.fetchall()
        if len(rows) == 0:
            c.close()
            return None

        c.close()
        return dict(
            username=rows[0][0],
            name=rows[0][1],
            staff_type_id=rows[0][2]
        )

    def get_ordered_items(self):
        rows = self.__query('SELECT * FROM item_order WHERE status_id < %s', [3])
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