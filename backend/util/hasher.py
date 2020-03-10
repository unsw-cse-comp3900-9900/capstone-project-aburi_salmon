import hashlib

import config

def hash_password(input):
    password = hashlib.sha256((input + config.SALT).encode()).hexdigest()
