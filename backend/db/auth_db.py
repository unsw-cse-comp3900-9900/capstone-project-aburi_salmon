import hmac

class auth_DB:

    def __init__(self, db):
        self.db = db

    # Compare the given password with the one in the database
    def login(self, username, password):
        rows = self.db.query("SELECT password FROM staff WHERE username = %s;", [username])
        if (not rows):
            return False

        # This compares two strings to prevent timing attack
        result = hmac.compare_digest(rows[0][0], password)
        return result
    
    # Check if a username is already taken
    def available_username(self, username):
        rows = self.db.query("SELECT COUNT(*) FROM staff WHERE username = %s;", [username])
        if (not rows):
            return False

        rlen = rows[0][0]
        return (rlen == 0)


    # Check if valid registration key
    def validate_key(self, key):
        rows = self.db.query("SELECT registration_key, staff_type FROM staff_registration WHERE registration_key = %s;", [key])
        if (rows == None or not rows[0]):
            return False

        return rows[0][1]

    # Insert a new user into the database
    def register(self, username, password, name, staff_type_id):
        self.db.insert("INSERT INTO staff (username, password, name, staff_type_id) VALUES (%s, %s, %s, %s);",
                      [username, password, name, staff_type_id])
        return True

    # Get a list of staff types and the associated registration key
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

    # Change the registration key for a staff type
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

    # Insert a new order into the order table. This is done when a customer selects a table.
    def insert_order(self, table_id):
        rows = self.db.query('INSERT INTO "order" (table_id) VALUES (%s) RETURNING id;', [table_id,])
        if not rows or not rows[0]:
            return None
        
        order_id = rows[0][0]
        return order_id

    # Set the state of a given table to True. This will signify that it is occupied.
    def selectTable(self, table_id):
        rows = self.db.query('SELECT state FROM "table" WHERE id = %s;', [table_id])

        if (not rows):
            print('Something went wrong')
            return False

        # Check if the table is already taken 
        if (rows[0][0]):
            print('table is taken!')
            return False
        else:
            self.db.update('UPDATE "table" SET state = %s WHERE id = %s', [True, table_id])
            return True

    # Set a table free given an order_id
    def set_table_free_order_id(self, id):
        return self.db.update('UPDATE "table" t SET state = %s WHERE id = (SELECT table_id FROM "order" WHERE id = %s)', [False, id])

    # Get staff user details given a username
    def get_profile(self, username):
        rows = self.db.query("SELECT username, name, staff_type_id FROM staff WHERE username = %s;", [username])    
        if (not rows):
            return None

        return dict(
            username=rows[0][0],
            name=rows[0][1],
            staff_type_id=rows[0][2],
        )
