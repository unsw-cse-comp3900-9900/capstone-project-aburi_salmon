from app import jwt

class User:
    def __init__(self, username, role, table):
        self.username = username
        self.role = role
        self.table = table

@jwt.user_claims_loader
def add_claims_to_access_token(user):
    return {
        'role': user.role,
        'table': user.table
    }

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.username

