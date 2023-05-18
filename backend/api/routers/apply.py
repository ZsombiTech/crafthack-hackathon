from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import ORJSONResponse

from pydantic import BaseModel

from api.models import User, Participation
from api.dependencies import Auth

import openai

user_application_messages = {}

router = APIRouter(
    default_response_class = ORJSONResponse,
    tags = ["applications"],
)


@router.get("/")
async def start_conservation(auth: Auth):
    uid = 1

    if not auth.is_authenticated():
        uid = 1
        #raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    
    if uid != 1:
        uid = auth.user_id

    user_application_messages[uid] = [{"role": "system", "content": """You are an organizer of a hackathon. Attendees write to you to apply and find teammates. We need the following information from the people:
- Name
- Their stack (3 most important)
- Presentation skills
- Hackathon experience
- Age
- Current work or education type
- Video editing skills
If the user hasn't answered any of these ask back. Only ask for one piece of information at a time. Keep the answers as short as possible. If you have every information needed close the conservation shortly and add this to the end: "<END_CONSERVATION>"""},
{"role": "assistant", "content": "What is your name?"}]
    
    return {
        "message": "What is your name?",
    }


class ApplyPost(BaseModel):
    message: str = ""

@router.post("/")
async def continue_conservation(
    auth: Auth,
    body: ApplyPost,
):
    uid = 1
    if not auth.is_authenticated():
        uid = 1
        #raise HTTPException(status.HTTP_401_UNAUTHORIZED)

    user_application_messages[uid].append({"role":"user", "content": body.message})

    if uid != 1:
        uid = auth.user_id

    print(user_application_messages)

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=user_application_messages[uid],
    )

    user_application_messages[uid].append({"role": "assistant", "content": response.choices[0].message.content})

    return {
        "message": response.choices[0].message.content,
    }