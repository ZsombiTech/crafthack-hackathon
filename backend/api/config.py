"""
Configuration file.
"""

import os

class Config:
    db_url = os.environ["DB_URL"]

    supabase_url = os.environ["SUPABASE_URL"]
    supabase_key = os.environ["SUPABASE_KEY"]

    jwt_secret = os.environ["JWT_SECRET"]
    jwt_issuer = os.environ["JWT_ISSUER"]

