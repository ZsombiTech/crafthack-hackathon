from typing import Annotated
from fastapi import Depends, Request

from .models import Permissions, User

def authenticate_request(request: Request):
    try:
        return User.authenticate_token(request.cookies["token"])
    except KeyError:
        return Permissions()
    
Auth = Annotated[Permissions, Depends(authenticate_request)]
