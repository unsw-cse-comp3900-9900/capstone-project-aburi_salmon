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