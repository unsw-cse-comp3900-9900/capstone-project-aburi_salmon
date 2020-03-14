from flask_restx import fields

from app import api

# This is for request payload that you can see in Swagger documentation

login_model = api.model('login', {
    "username": fields.String(description='Username'),
    "password": fields.String(description='Password')
})

registration_model = api.model('registration', {
    'type': fields.String(description='The object type', enum=['Wait', 'Kitchen', 'Management']),
})
