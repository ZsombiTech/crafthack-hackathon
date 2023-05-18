from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import ORJSONResponse

from pydantic import BaseModel

from api.models import User, Participation, Event
from api.dependencies import Auth

import time


router = APIRouter(
    default_response_class = ORJSONResponse,
    tags = ["users"],
)


@router.get("/me")
async def user_me_get(
    auth: Auth,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        user = await auth.get_user()
    except User.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

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
    user_id: int,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        user = await User.get_by_id(user_id)
    except User.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "staff": user.staff,
        "last_modified": user.last_modified,
    }


@router.get("/")
async def users_all_get(
    auth: Auth,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    users = await User.filter()

    return [
        {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "staff": user.staff,
            "last_modified": user.last_modified,
        }
        for user in users
    ]


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
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, 
                "Email already used."
            )
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


class UserPatch(BaseModel):
    email: str = None
    password: str = None
    name: str = None
    staff: bool = None


@router.patch("/me")
async def user_me_patch(
    auth: Auth,
    body: UserPatch,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    if body.staff is not None:
        if not auth.is_staff():
            raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        user = await auth.get_user()
    except User.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    await _user_patch(user, body.email, body.password, body.name)


@router.patch("/{user_id}")
async def user_patch(
    auth: Auth,
    user_id: int,
    body: UserPatch,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    if not auth.is_staff() and auth.user_id != user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    if body.staff is not None:
        if not auth.is_staff():
            raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    try:
        user = await User.get_by_id(user_id)
    except User.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    await _user_patch(auth, user, body.email, 
                      body.password, body.name, body.staff)


async def _get_participations(
    user_id: int
):
    user = await User.get_by_id(user_id)

    participations = await Participation.select().where(Participation.user == user)

    return [
        {
            "id": participation.id,
            "event": participation.event
        }
        for participation in participations
    ]


@router.get("/me/participation")
async def user_me_participations_get(
    auth: Auth,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    return await _get_participations(auth.user_id)


@router.get("/{user_id}/participation")
async def user_participations_get(
    auth: Auth,
    user_id: int,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    if not auth.is_staff() and auth.user_id != user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    return await _get_participations(user_id)


async def _join_event(
    user_id: int,
    event_id: int,
    format: str,
    needs_teammates: bool,
    description: str,
):
    # check if event exists
    try:
        event = await Event.get_by_id(event_id)
    except Event.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    participation = Participation(
        user = user_id,
        event = event_id,
        format = format,
        needs_teammates = needs_teammates,
        description = description,
    )
    await participation.save()


class UserParticipatePost(BaseModel):
    event_id: int
    format: str
    needs_teammates: bool = False
    description: str = None


@router.post("/me/participation/{event_id}")
async def user_me_participation_post(
    auth: Auth,
    event_id: int,
    body: UserParticipatePost,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    await _join_event(
        auth.user_id,
        event_id,
        body.format,
        body.needs_teammates,
        body.description,
    )


@router.post("/{user_id}/participation/{event_id}")
async def user_participation_post(
    auth: Auth,
    user_id: int,
    event_id: int,
    body: UserParticipatePost,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    if not auth.is_staff() and auth.user_id != user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    await _join_event(
        user_id,
        event_id,
        body.format,
        body.needs_teammates,
        body.description,
    )


async def _leave_event(
    user_id: int,
    event_id: int,
):
    try:
        participation = await Participation.get(user = user_id, event = event_id)
    except Participation.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    
    await participation.delete()


@router.delete("/me/participation/{event_id}")
async def user_me_participation_delete(
    auth: Auth,
    event_id: int,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    await _leave_event(auth.user_id, event_id)


@router.delete("/{user_id}/participation/{event_id}")
async def user_participation_delete(
    auth: Auth,
    user_id: int,
    event_id: int,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    if not auth.is_staff() and auth.user_id != user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    await _leave_event(user_id, event_id)


async def _patch_participation(
    user_id: int,
    event_id: int,
    format: str = None,
    needs_teammates: bool = None,
    description: str = None,
):
    try:
        participation = await Participation.get(user = user_id, event = event_id)
    except Participation.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    if format is not None:
        participation.format = format

    if needs_teammates is not None:
        participation.needs_teammates = needs_teammates

    if description is not None:
        participation.description = description

    await participation.save()


class UserParticipatePatch(BaseModel):
    format: str = None
    needs_teammates: bool = None
    description: str = None


@router.patch("/me/participation/{event_id}")
async def user_me_participation_patch(
    auth: Auth,
    event_id: int,
    body: UserParticipatePatch,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    await _patch_participation(
        auth.user_id,
        event_id,
        body.format,
        body.needs_teammates,
        body.description,
    )


@router.patch("/{user_id}/participation/{event_id}")
async def user_participation_patch(
    auth: Auth,
    user_id: int,
    event_id: int,
    body: UserParticipatePatch,
):
    if not auth.is_authenticated():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    if not auth.is_staff() and auth.user_id != user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    await _patch_participation(
        user_id,
        event_id,
        body.format,
        body.needs_teammates,
        body.description,
    )
