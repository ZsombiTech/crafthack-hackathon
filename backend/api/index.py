"""
API entry point.
"""

from api.routers import auth, user, event

from fastapi import FastAPI

app = FastAPI()

app.include_router(router = auth.router, prefix = "/auth")
app.include_router(router = user.router, prefix = "/user")
app.include_router(router = event.router, prefix = "/event")
