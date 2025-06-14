from aris.models import File, Tag
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, get_db, current_user

router = APIRouter(prefix="/users", tags=["users", "tags"], dependencies=[Depends(current_user)])


class TagRetrieveOrUpdate(BaseModel):
    id: int
    user_id: int
    name: str
    color: str


class TagCreate(BaseModel):
    name: str
    color: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Tag name cannot be empty")
        if len(v) < 1:
            raise ValueError("Tag name must be at least 1 character long")
        if len(v) > 50:
            raise ValueError("Tag name cannot exceed 50 characters")
        return v


@router.post(
    "/{user_id}/tags",
    response_model=TagRetrieveOrUpdate,
    status_code=status.HTTP_201_CREATED,
)
async def create_tag(user_id: int, tag: TagCreate, db: AsyncSession = Depends(get_db)):
    """Create a new tag for the user."""
    user = await crud.get_user(user_id, db)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    tag = await crud.create_tag(user_id, tag.name, tag.color, db)
    if tag is None:
        raise HTTPException(status_code=400, detail="Error creating tag")
    return tag


@router.get("/{user_id}/tags", response_model=list[TagRetrieveOrUpdate])
async def get_user_tags(user_id: int, db: AsyncSession = Depends(get_db)):
    """Get all tags for a user."""
    tags = await crud.get_user_tags(user_id, db)
    return tags


@router.put("/{user_id}/tags/{_id}", response_model=TagRetrieveOrUpdate)
async def update_tag(tag: TagRetrieveOrUpdate, db: AsyncSession = Depends(get_db)):
    """Update the name of a tag."""
    if tag.id not in (t["id"] for t in await crud.get_user_tags(tag.user_id, db)):
        raise HTTPException(status_code=404, detail="Tag not found")
    try:
        updated_tag = await crud.update_tag(tag.id, tag.user_id, tag.name, tag.color, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Error updating tag " + str(e))
    return updated_tag


@router.delete("/{user_id}/tags/{_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a tag for a user."""
    if _id not in (t["id"] for t in await crud.get_user_tags(user_id, db)):
        raise HTTPException(status_code=404, detail="Tag not found")

    deleted_tag = await crud.soft_delete_tag(_id, user_id, db)
    if deleted_tag is None:
        raise HTTPException(status_code=400, detail="Error deleting tag: " + str(_id))
    return deleted_tag


@router.get("/{user_id}/files/{file_id}/tags")
async def get_user_file_tags(user_id: int, file_id: int, db: AsyncSession = Depends(get_db)):
    """Get a user's tags assigned to the file."""
    try:
        result = await crud.get_user_file_tags(user_id, file_id, db)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error fetching tags for file {file_id}: " + str(e),
        )
    return result


@router.post("/{user_id}/files/{doc_id}/tags/{_id}")
async def add_tag_to_file(user_id: int, doc_id: int, _id: int, db: AsyncSession = Depends(get_db)):
    """Assign a tag to a file."""
    try:
        await crud.add_tag_to_file(user_id, doc_id, _id, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Error adding tag: " + str(e))
    return {"message": "Tag added successfully"}


@router.delete("/{user_id}/files/{doc_id}/tags/{_id}")
async def remove_tag_from_file(
    user_id: int, doc_id: int, _id: int, db: AsyncSession = Depends(get_db)
):
    """Remove a tag from a file."""
    try:
        await crud.remove_tag_from_file(user_id, doc_id, _id, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Error removing tag: " + str(e))
    return {"message": "Tag removed successfully"}
