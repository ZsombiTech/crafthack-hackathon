from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import ORJSONResponse

from pydantic import BaseModel

from api.models import User, Participation


router = APIRouter(
    default_response_class = ORJSONResponse,
    tags = ["stats"],
)


@router.get("/user_count")
async def user_count_get():
    return await User.select().count()