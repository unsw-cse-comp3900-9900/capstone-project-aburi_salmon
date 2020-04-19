class profile_DB:

    def __init__(self, db):
        self.db = db

    def get_profile(self, username):
        rows = self.db.query("SELECT username, name, staff_type_id FROM staff WHERE username = %s;", [username])    
        if (not rows):
            return None

        return dict(
            username=rows[0][0],
            name=rows[0][1],
            staff_type_id=rows[0][2],
        )

    def update_staff(self, username, name, staff_type_id):
        return self.db.update("UPDATE staff SET name = %s, staff_type_id = %s WHERE username = %s", [name, staff_type_id, username])

