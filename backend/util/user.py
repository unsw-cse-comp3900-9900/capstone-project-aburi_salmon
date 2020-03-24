from app import jwt

class User:
    def __init__(self, username, role, order):
        self.username = username
        self.role = role
        self.order = order

@jwt.user_claims_loader
def add_claims_to_access_token(user):
    return {
        'role': user.role,
        'order': user.order
    }

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.username

