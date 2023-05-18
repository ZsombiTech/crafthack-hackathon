from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import ORJSONResponse

from ..models import User
from ..dependencies import Auth

import time


router = APIRouter(
    default_response_class = ORJSONResponse,
    tags = ["user"],
)


@router.get("/me")
async def user_me_get(
    auth: Auth,
):
    if not auth.is_authenticated():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        user = await auth.get_user()
    except User.DoesNotExist:
        return HTTPException(status.HTTP_404_NOT_FOUND)

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "staff": user.staff,
        "last_modified": user.last_modified,
    }


@router.get("/{user_id}")
async def user_get(
    auth: Auth,
    user_id: str,
):
    #if not auth.is_authenticated():
    #    return HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        user = await User.get_by_id(user_id)
    except User.DoesNotExist:
        return HTTPException(status.HTTP_404_NOT_FOUND)

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "staff": user.staff,
        "last_modified": user.last_modified,
    }


async def _user_patch(
    user: User,
    email: str = None,
    password: str = None,
    name: str = None,
    staff: bool = None,
):
    if email is not None:
        email = email.lower()
        if len(await User.filter(email = email)) > 0:
            return HTTPException(status.HTTP_400_BAD_REQUEST, "Email already used.")
        user.email = email
        user.last_modified = int(time.time())

    if password is not None:
        user.set_password(password)
        user.last_modified = int(time.time())

    if name is not None:
        user.name = name

    if staff is not None:
        user.staff = staff
        user.last_modified = int(time.time())

    await user.save()


@router.patch("/me")
async def user_me_patch(
    auth: Auth,
    email: str = None,
    password: str = None,
    name: str = None,
    staff: bool = None,
):
    if not auth.is_authenticated():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)

    if staff is not None:
        if not auth.is_staff():
            return HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        user = await auth.get_user()
    except User.DoesNotExist:
        return HTTPException(status.HTTP_404_NOT_FOUND)

    await _user_patch(user, email, password, name)


@router.patch("/{user_id}")
async def user_patch(
    auth: Auth,
    user_id: str,
    email: str = None,
    password: str = None,
    name: str = None,
    staff: bool = None,
):
    if not auth.is_authenticated():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)

    if not auth.is_staff() and auth.user_id != user_id:
        return HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    if staff is not None:
        if not auth.is_staff():
            return HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    try:
        user = await User.get_by_id(user_id)
    except User.DoesNotExist:
        return HTTPException(status.HTTP_404_NOT_FOUND)

    await _user_patch(auth, user, email, password, name, staff)
