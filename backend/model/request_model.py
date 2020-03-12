from flask_restx import fields

from app import api

# This is for request payload that you can see in Swagger documentation

login_model = api.model('login', {
    "username": fields.String(description='Username'),
    "password": fields.String(description='Password')
})

signup_model = api.model('signup', {
    "name": fields.String(description='Name'),
    "username": fields.String(description='Username'),
    "password": fields.String(description='Password'),
    "registration_key": fields.String(description='Registration_Key')
  #  "staff_type_id": fields.Integer(description='Staff_type_id')
})
