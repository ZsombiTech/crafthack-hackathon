"""
API entry point.
"""

from api.routers import auth, user

from fastapi import FastAPI

api = FastAPI()

api.include_router(router = auth.router, prefix = "/auth")
api.include_router(router = user.router, prefix = "/user")

@api.get("/")
async def test_get():
    return {
        "message": "Hello, world!",
    }
