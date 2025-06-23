from .auth import router as auth_router
from .file import router as file_router
from .file_annotations import router as file_annotations_router
from .file_assets import router as file_assets_router
from .file_settings import router as file_settings_router
from .render import router as render_router
from .signup import router as signup_router
from .tag import router as tag_router
from .user import router as user_router


__all__ = [
    "auth_router",
    "file_annotations_router",
    "file_router",
    "file_assets_router",
    "file_settings_router",
    "render_router",
    "signup_router",
    "tag_router",
    "user_router",
]
