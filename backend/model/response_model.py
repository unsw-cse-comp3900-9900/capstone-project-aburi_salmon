from app import api
from flask_restx import fields

example_model = api.model('example', {
    "example_key": fields.String(description='Put value for this')
})