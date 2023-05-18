"""
Async PostgreSQL ORM and models.
"""

from api.config import Config

import peewee
from peewee_aio import Manager, AIOModel, fields
manager = Manager(
    url = Config.db_url,
)

import bcrypt
import jwt
import time


class Permissions:
    def __init__(self, claims: dict = {}):
        try:
            self.user_id: str = claims["sub"]
        except:
            self.user_id = None
        try:
            self.scopes: list[str] = claims["scopes"]
        except:
            self.scopes = []

    def is_authenticated(self):
        return self.user_id is not None

    def is_staff(self):
        return "staff" in self.scopes

    async def get_user(self):
        user: User = await User.get_by_id(self.user_id)
        return user


@manager.register
class User(AIOModel):
    id = fields.AutoField()
    email = fields.CharField()
    password = fields.CharField()
    last_modified = fields.IntegerField()
    staff = fields.BooleanField(default = False)
    name = fields.CharField()

    class Meta:
        table_name = "users"

    @classmethod
    async def issue_token(cls, user_id: str, expiration: int = 600):
        user: User = await cls.get_by_id(user_id)
        scopes: list[str] = []

        if user.staff:
            scopes.append("staff")

        claims = {
            "iss": Config.jwt_issuer, # issuer
            "sub": user_id, # subject (user primary key)
            "iat": int(time.time()), # time of issuance, unix timestamp
            "exp": int(time.time()) + expiration, # expiration time, in seconds
            "scopes": scopes
        }
        token: str = jwt.encode(claims, Config.jwt_secret, algorithm = "HS256")
        return token

    @classmethod
    def authenticate_token(cls, token: str):
        try:
            # throws if invalid or expired
            claims: dict = jwt.decode(
                token, 
                Config.jwt_secret, 
                algorithms = [ "HS256" ],
                issuer = Config.jwt_issuer,
                options = { "require": ["iss", "sub", "iat", "exp", "scopes"] }
            )
            return Permissions(claims)
        except:
            return Permissions()

    @classmethod
    async def reissue_token(cls, token: str, expiration: int = 600):
        try:
            # throws if invalid, but not when expired
            claims: dict = jwt.decode(
                token, 
                Config.jwt_secret, 
                algorithms = [ "HS256" ],
                issuer = Config.jwt_issuer,
                options = { 
                    "require": ["iss", "sub", "iat", "exp", "scopes"],
                    "verify_exp": False,
                }
            )
            user_id: int = claims["sub"]
            user: User = await cls.get_by_id(user_id)

            # denying request if the account was modified since the issuance
            issuance: int = claims["iat"]
            if user.last_modified >= issuance:
                return None, None

            # case: the account exists and was not modified so the user can continue their session
            return await cls.issue_token(user_id, expiration), user_id
        except:
            # case: previous token was invalid or the account does not exist
            return None, None
        
    def set_password(self, plain: str):
        try:
            self.password = bcrypt.hashpw(plain.encode("utf8"), bcrypt.gensalt()).decode("utf8")
        except:
            # it seems like on some platforms hashpw returns not bytes but str
            self.password = bcrypt.hashpw(plain.encode("utf8"), bcrypt.gensalt())

    def check_password(self, plain: str):
        try:
            return bcrypt.checkpw(plain.encode("utf8"), self.password.encode("utf8"))
        except:
            return False


@manager.register
class Event(AIOModel):
    id = fields.AutoField()
    title = fields.CharField()
    start_time = fields.IntegerField()
    end_time = fields.IntegerField()
    format = fields.CharField()
    prize = fields.IntegerField()
    participants = fields.IntegerField()
    thumbnail = fields.CharField()
    description = fields.TextField()

    class Meta:
        table_name = "events"
