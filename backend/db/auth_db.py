import hmac

class auth_DB:

    def __init__(self, db):
        self.db = db

    
    def login(self, username, password):
        rows = self.db.query("SELECT password FROM staff WHERE username = %s;", [username])
        if (not rows):
            return False

        # This compares two strings to prevent timing attack
        result = hmac.compare_digest(rows[0][0], password)
        return result


    def get_profile(self, username):
        rows = self.db.query("SELECT username, name, staff_type_id FROM staff WHERE username = %s;", [username])    
        if (not rows):
            return None

        return dict(
            username=rows[0][0],
            name=rows[0][1],
            staff_type_id=rows[0][2],
        )


    def available_username(self, username):
        rows = self.db.query("SELECT COUNT(*) FROM staff WHERE username = %s;", [username])
        if (not rows):
            return False

        rlen = rows[0][0]
        return (rlen == 0)


    def validate_key(self, key):
        # Check if valid key
        rows = self.db.query("SELECT registration_key, staff_type FROM staff_registration WHERE registration_key = %s;", [key])
        if (rows == None or not rows[0]):
            return False

        return rows[0][1]


    def register(self, username, password, name, staff_type_id):
        self.db.insert("INSERT INTO staff (username, password, name, staff_type_id) VALUES (%s, %s, %s, %s);",
                      [username, password, name, staff_type_id])
        return True


    def get_registration_keys(self, staff_type):
        if (staff_type):
            keys = self.db.query(
                'SELECT registration_key, title, id FROM staff_registration sr JOIN staff_type st ON (sr.staff_type = st.id) WHERE st.id = %s',
                [staff_type]
            )
        else:
           keys = self.db.query('SELECT registration_key, title, id FROM staff_registration sr JOIN staff_type st ON (sr.staff_type = st.id)')

        if keys is None:
            return []

        return [
            {
                'key': key[0],
                'staff_name': key[1],
                'staff_id': key[2]
            } for key in keys
        ]


    def set_registration_key(self, registration_key, staff_type):

        self.db.update(
            """
                UPDATE staff_registration
                SET registration_key = %s
                FROM staff_type
                WHERE staff_type.id = staff_registration.staff_type AND staff_type.title = %s;
            """,
            [registration_key, staff_type]
        )
        return True


    def insert_order(self, table_id):
        self.db.insert('INSERT INTO "order" (table_id) VALUES (%s);', [table_id,])
        order_id = self.db.query('SELECT id FROM "order" ORDER BY id DESC LIMIT %s', [1,])[0][0]
        
        return order_id  

    def selectTable(self, table_id):
        rows = self.db.query('SELECT state FROM "table" WHERE id = %s;', [table_id])

        if (not rows):
            print('Something went wrong')
            return False

        # 1 means the table is unavailable 
        if (rows[0][0]):
            print('table is taken!')
            return False
        else:
            self.db.update('UPDATE "table" SET state = %s WHERE id = %s', [True, table_id])
            return True


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


    def set_table_free_order_id(self, id):
        return self.db.update('UPDATE "table" t SET state = %s WHERE id = (SELECT table_id FROM "order" WHERE id = %s)', [False, id])
