from typing import Annotated
from fastapi import Depends, Request

from api.models import Permissions, User

def authenticate_request(request: Request):
    try:
        token = request.headers["Authorization"].split(" ")[1]
        perms = User.authenticate_token(token)
        return perms
    except:
        return Permissions()
    
Auth = Annotated[Permissions, Depends(authenticate_request)]
