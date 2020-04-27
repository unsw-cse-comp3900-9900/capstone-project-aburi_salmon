import hashlib

import config

def hash_password(input):
    return hashlib.sha256((input + config.SALT).encode()).hexdigest()
