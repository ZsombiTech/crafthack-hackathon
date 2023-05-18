from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import ORJSONResponse

from pydantic import BaseModel

from api.models import User
from api.dependencies import Auth

import time


router = APIRouter(
    default_response_class = ORJSONResponse,
    tags = ["auth"],
)


class RegisterPost(BaseModel):
    email: str = None
    password: str = None
    name: str = None
    staff: bool = False


@router.post("/register")
async def register_post(
    response: Response,
    auth: Auth,
    body: RegisterPost,
):
    if body.staff is True and not auth.is_staff():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    email = body.email.lower()
    if len(await User.filter(email = email)) > 0:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already used.")

    user = User(
        email = email,
        name = body.name,
        staff = body.staff,
        last_modified = int(time.time()),
    )
    user.set_password(body.password)
    await user.save()

    token = await User.issue_token(user.id)
    response.set_cookie(
        key = "token",
        value = token,
        max_age = 400 * 24 * 3600,
        httponly = True,
        samesite = "Strict",
    )
    return {
        "user_id": user.id,
        "token": token
    }


async def _login_password(
    response: Response, 
    email: str, 
    password: str
):
    try:
        email = email.lower()
        user = await User.get(email = email)
    except User.DoesNotExist:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "There is no account associated with this email."
        )
    
    if not user.password:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "The account does not have password login set up. "
            "Did you register through another provider?"
        )

    if not user.check_password(password):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Wrong password.")

    token = await User.issue_token(user.id)
    response.set_cookie(
        key = "token",
        value = token,
        max_age = 400 * 24 * 3600,
        httponly = True,
        samesite = "Strict",
    )
    return {
        "user_id": user.id,
        "token": token
    }


async def _login_reissue(
    response: Response, 
    token: str
):
    new, user_id = await User.reissue_token(token)
    if new is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Token invalid or account was modified and must relogin."
        )
    response.set_cookie(
        key = "token",
        value = new,
        max_age = 400 * 24 * 3600,
        httponly = True,
        samesite = "Strict",
    )
    return {
        "user_id": user_id,
        "token": new
    }


class LoginPost(BaseModel):
    email: str = None
    password: str = None
    old: str = None


@router.post("/login")
async def login_post(
    response: Response, 
    body: LoginPost,
):
    if body.email is not None and body.password is not None:
        return await _login_password(response, body.email, body.password)

    if body.old is not None:
        return await _login_reissue(response, body.old)
    
    raise HTTPException(
        status.HTTP_400_BAD_REQUEST,
        "Invalid login method."
    )
