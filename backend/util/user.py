from app import jwt

class User:
    def __init__(self, username, roles):
        self.username = username
        self.roles = roles

@jwt.user_claims_loader
def add_claims_to_access_token(user):
    return {
        'roles': user.roles
    }

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.username

