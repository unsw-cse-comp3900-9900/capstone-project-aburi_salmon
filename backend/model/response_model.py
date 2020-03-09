from flask_restx import fields

from app import api

# This is for responses that you can see in Swagger documentation

example_model = api.model('example', {
    "example_key": fields.String(description='Put value for this')
})