class DbConfig:
    def __init__(self, host, port, database, user, password):
        self.PGDBNAME = database
        self.PGPORT = port
        self.PGUSER = user
        self.PGPASSWORD = password
        self.PGHOST = host

    def config(self):
        dbconfig = "dbname='" + self.PGDBNAME + "' user='" + self.PGUSER + "' host='" + self.PGHOST + "' port='" + self.PGPORT + "' password='" + self.PGPASSWORD + "'"
        return dbconfig
