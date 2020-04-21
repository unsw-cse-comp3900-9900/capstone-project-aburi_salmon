import hmac

#import psycopg2

#from model.dbconfig import DbConfig
#from app import db

class profile_DB:
    
    def __init__(self, db):
         self.db = db

### Methods used in staff_profiles.py

    # return lists of all staffs and their details
    def get_all_staff(self):
        rows = self.db.query('SELECT s.id, s.name, s.username, st.title FROM staff s, staff_type st WHERE s.staff_type_id = st.id AND st.id > %s', [0,])

        if (not rows):
            return None

        staff_list = []
        for row in rows:
            myDict = {
                'id': row[0],
                'name': row[1],
                'username': row[2],
                'staff_type': row[3]
            }
            staff_list.append(myDict)

        return staff_list

    # return a dictionary of a staff's details according to the staff_id inputed
    def get_staff_detail(self, staff_id):
        row = self.db.query('SELECT s.id, s.name, s.username, s.staff_type_id FROM staff s WHERE s.id = %s', [staff_id,])
        print("ROW")
        print(row)
        if (not row):
            return None

        myDict = {
            'id': row[0][0],
            'name': row[0][1],
            'username': row[0][2],
            'staff_type': row[0][3]
        }

        return myDict

    # modify staff's details based on the inputed parameter
    # return true if success and false otherwise
    def modify_staff(self, nid, nname, nusername, nstaff_type):
        return self.db.update("UPDATE staff SET name = %s, username = %s, staff_type_id = %s WHERE id = %s", [nname, nusername, nstaff_type, nid])

    # delete a staff's record based on the inputed staff_id
    # return true if success and false otherwise
    def delete_staff(self, staff_id):
        return self.db.delete("DELETE FROM staff WHERE id = %s", [staff_id,])