from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import uuid

SESSION_COOKIE_NAME = "session_id"
SESSION_COOKIE_MAX_AGE = 60 * 60 * 72

class SessionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        session_id = request.cookies.get(SESSION_COOKIE_NAME)
        new_session = False

        if not session_id:
            session_id = str(uuid.uuid4())
            new_session = True

        request.state.session_id = session_id
        response = await call_next(request)

        # Always refresh cookie to extend session (optional)
        response.set_cookie(
            SESSION_COOKIE_NAME,
            session_id,
            max_age=SESSION_COOKIE_MAX_AGE,
            httponly=True,
            samesite="lax",
            # secure=True,  # <--- Enable for HTTPS in prod
        )
        return response

