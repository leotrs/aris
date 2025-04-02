from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .. import crud, get_db
from ..models import Document, Tag, User

router = APIRouter()


class TagCreateOrUpdate(BaseModel):
    user_id: int
    name: str


@router.post(
    "/tags/", response_model=TagCreateOrUpdate, status_code=status.HTTP_201_CREATED
)
async def create_tag(tag: TagCreateOrUpdate, db: Session = Depends(get_db)):
    """Create a new tag for the user."""
    user = crud.get_user(tag.user_id, db)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    tag = crud.create_tag(tag.user_id, tag.name, db)
    if tag is None:
        raise HTTPException(status_code=400, detail="Error creating tag")
    return tag


@router.get("/tags/{user_id}/", response_model=list[TagCreateOrUpdate])
async def get_user_tags(user_id: int, db: Session = Depends(get_db)):
    """Get all tags for a user."""
    tags = crud.get_user_tags(user_id, db)
    if not tags:
        raise HTTPException(status_code=404, detail="No tags found")
    return tags


@router.put("/tags/{tag_id}/", response_model=TagCreateOrUpdate)
async def update_tag(
    tag_id: int, tag: TagCreateOrUpdate, db: Session = Depends(get_db)
):
    """Update the name of a tag."""
    if tag.tag_id not in (t.id for t in crud.get_user_tags(tag.user_id, db)):
        raise HTTPException(status_code=404, detail="Tag not found")

    updated_tag = crud.update_tag(tag.tag_id, tag.user_id, tag.tag_name)
    if updated_tag is None:
        raise HTTPException(status_code=400, detail="Error updating tag: " + str(e))
    return updated_tag


@router.delete("/tags/{tag_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(tag_id: int, user_id: int, db: Session = Depends(get_db)):
    """Delete a tag for a user."""
    if tag_id not in (t.id for t in crud.get_user_tags(user_id, db)):
        raise HTTPException(status_code=404, detail="Tag not found")

    deleted_tag = crud.soft_delete_tag(tag_id, user_id)
    if deleted_tag is None:
        raise HTTPException(status_code=400, detail="Error updating tag: " + str(e))
    return deleted_tag
