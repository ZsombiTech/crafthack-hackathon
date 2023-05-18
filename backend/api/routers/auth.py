from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import ORJSONResponse

from api.models import User
from api.dependencies import Auth

import time


router = APIRouter(
    default_response_class = ORJSONResponse,
    tags = ["auth"],
)


@router.post("/register")
async def register_post(
    auth: Auth,
    email: str,
    password: str,
    name: str,
    staff: bool = False,
):
    if staff is True and not auth.is_staff():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    email = email.lower()
    if len(await User.filter(email = email)) > 0:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already used.")

    user = User(
        email = email,
        name = name,
        staff = staff,
        last_modified = int(time.time()),
    )
    user.set_password(password)
    await user.save()


async def _login_password(response: Response, email: str, password: str):
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
    }


async def _login_reissue(response: Response, token: str):
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
    }


@router.get("/login")
async def login_get(
    response: Response, 
    email: str = None, 
    password: str = None, 
    old: str = None, 
):
    if email is not None and password is not None:
        return await _login_password(response, email, password)

    if old is not None:
        return await _login_reissue(response, old)
    
    raise HTTPException(
        status.HTTP_400_BAD_REQUEST,
        "Invalid login method."
    )
