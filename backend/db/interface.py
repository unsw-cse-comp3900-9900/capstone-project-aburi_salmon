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
            c.execute("SELECT COUNT(*) FROM roles WHERE key = %s;", (key,))
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
        return rows[0][0] == 1
