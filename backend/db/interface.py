import hmac

import psycopg2

from model.dbconfig import DbConfig

class DB:
    def __init__(self, dbConfig=DbConfig):
        self.__conn = psycopg2.connect(dbConfig.config())

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
        c = self.__conn.cursor()

        try:
            # This might be different, depending on your table and column name
            c.execute("SELECT password FROM staff WHERE username = %s;", (username,))
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