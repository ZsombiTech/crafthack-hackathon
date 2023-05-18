"""
API entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import auth, user, event, stats, apply

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(router = auth.router, prefix = "/auth")
app.include_router(router = user.router, prefix = "/user")
app.include_router(router = event.router, prefix = "/event")
app.include_router(router = stats.router, prefix = "/stats")
app.include_router(router = apply.router, prefix = "/apply")