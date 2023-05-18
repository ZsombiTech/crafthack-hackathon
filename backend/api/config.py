"""
Configuration file.
"""

import os

class Config:
    db_url = os.environ["DB_URL"]

    jwt_secret = os.environ["JWT_SECRET"]
    jwt_issuer = os.environ["JWT_ISSUER"]

