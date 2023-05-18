from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import ORJSONResponse

from pydantic import BaseModel

from api.models import Event, User
from api.dependencies import Auth


router = APIRouter(
    default_response_class = ORJSONResponse,
    tags = ["events"],
)


@router.get("/")
async def events_all_get(
    auth: Auth,
):
    if not auth.is_authenticated():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)

    events = await Event.filter()
    return [{
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "thumbnail": event.thumbnail,
        "start_time": event.start_time,
        "end_time": event.end_time,
        "format": event.format,
        "prize": event.prize,
    } for event in events]


@router.get("/{event_id}")
async def event_get(
    auth: Auth,
    event_id: int,
):
    if not auth.is_authenticated():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        event = await Event.get_by_id(event_id)
    except Event.DoesNotExist:
        return HTTPException(status.HTTP_404_NOT_FOUND)

    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "thumbnail": event.thumbnail,
        "start_time": event.start_time,
        "end_time": event.end_time,
        "format": event.format,
        "prize": event.prize,
    }


class EventPost(BaseModel):
    title: str
    description: str
    thumbnail: str
    start_time: int
    end_time: int
    format: str
    prize: int


@router.post("/")
async def event_post(
    auth: Auth,
    body: EventPost,
):
    if not auth.is_authenticated():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    if not auth.is_staff():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)

    event = Event(
        title = body.title,
        description = body.description,
        thumbnail = body.thumbnail,
        start_time = body.start_time,
        end_time = body.end_time,
        format = body.format,
        prize = body.prize,
    )
    await event.save()


class EventPatch(BaseModel):
    title: str = None
    description: str = None
    thumbnail: str = None
    start_time: int = None
    end_time: int = None
    format: str = None
    prize: int = None


@router.patch("/{event_id}")
async def event_patch(
    auth: Auth,
    event_id: int,
    body: EventPost
):
    if not auth.is_authenticated():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    if not auth.is_staff():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        event = await Event.get_by_id(event_id)
    except Event.DoesNotExist:
        return HTTPException(status.HTTP_404_NOT_FOUND)

    if body.title:
        event.title = body.title

    if body.description:
        event.description = body.description

    if body.thumbnail:
        event.thumbnail = body.thumbnail

    if body.start_time:
        event.start_time = body.start_time

    if body.end_time:
        event.end_time = body.end_time

    if body.format:
        event.format = body.format

    if body.prize:
        event.prize = body.prize

    await event.save()


@router.delete("/{event_id}")
async def event_delete(
    auth: Auth,
    event_id: int,
):
    if not auth.is_authenticated():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    if not auth.is_staff():
        return HTTPException(status.HTTP_401_UNAUTHORIZED)

    try:
        event = await Event.get_by_id(event_id)
    except Event.DoesNotExist:
        return HTTPException(status.HTTP_404_NOT_FOUND)

    await event.delete()
