"""Routes to manage annotations (notes and comments)."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from .. import get_db, current_user
from ..models import Annotation, AnnotationType, AnnotationMessage


router = APIRouter(
    prefix="/annotations", tags=["files", "annotations"], dependencies=[Depends(current_user)]
)


class AnnotationMessageCreate(BaseModel):
    content: str
    owner_id: int


class AnnotationMessageResponse(BaseModel):
    id: int
    annotation_id: int
    owner_id: int
    content: str
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AnnotationCreate(BaseModel):
    file_id: int
    type: AnnotationType


class AnnotationUpdate(BaseModel):
    type: Optional[AnnotationType] = None


class AnnotationResponse(BaseModel):
    id: int
    file_id: int
    type: AnnotationType
    created_at: datetime
    deleted_at: Optional[datetime] = None
    messages: list[AnnotationMessageResponse] = []

    class Config:
        from_attributes = True


@router.post("/", response_model=AnnotationResponse, status_code=status.HTTP_201_CREATED)
def create_annotation(annotation: AnnotationCreate, db: AsyncSession = Depends(get_db)):
    db_annotation = Annotation(**annotation.dict())
    db.add(db_annotation)
    db.commit()
    db.refresh(db_annotation)
    return db_annotation


@router.get("/", response_model=list[AnnotationResponse])
def get_annotations(
    file_id: Optional[int] = None,
    type: Optional[AnnotationType] = None,
    include_deleted: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    query = db.query(Annotation)

    if not include_deleted:
        query = query.filter(Annotation.deleted_at.is_(None))

    if file_id:
        query = query.filter(Annotation.file_id == file_id)

    if type:
        query = query.filter(Annotation.type == type)

    return query.offset(skip).limit(limit).all()


@router.get("/{annotation_id}", response_model=AnnotationResponse)
def get_annotation(annotation_id: int, db: AsyncSession = Depends(get_db)):
    annotation = (
        db.query(Annotation)
        .filter(and_(Annotation.id == annotation_id, Annotation.deleted_at.is_(None)))
        .first()
    )

    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")

    return annotation


@router.put("/{annotation_id}", response_model=AnnotationResponse)
def update_annotation(
    annotation_id: int, annotation_update: AnnotationUpdate, db: AsyncSession = Depends(get_db)
):
    annotation = (
        db.query(Annotation)
        .filter(and_(Annotation.id == annotation_id, Annotation.deleted_at.is_(None)))
        .first()
    )

    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")

    update_data = annotation_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(annotation, field, value)

    db.commit()
    db.refresh(annotation)
    return annotation


@router.delete("/{annotation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_annotation(annotation_id: int, db: AsyncSession = Depends(get_db)):
    annotation = (
        db.query(Annotation)
        .filter(and_(Annotation.id == annotation_id, Annotation.deleted_at.is_(None)))
        .first()
    )

    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")

    annotation.deleted_at = datetime.utcnow()
    db.commit()


# AnnotationMessage CRUD routes
@router.post(
    "/{annotation_id}/messages",
    response_model=AnnotationMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_annotation_message(
    annotation_id: int, message: AnnotationMessageCreate, db: AsyncSession = Depends(get_db)
):
    # Verify annotation exists
    annotation = (
        db.query(Annotation)
        .filter(and_(Annotation.id == annotation_id, Annotation.deleted_at.is_(None)))
        .first()
    )

    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")

    # Check constraint: notes can only have one non-deleted message
    if annotation.type == AnnotationType.NOTE:
        existing_count = (
            db.query(AnnotationMessage)
            .filter(
                and_(
                    AnnotationMessage.annotation_id == annotation_id,
                    AnnotationMessage.deleted_at.is_(None),
                )
            )
            .count()
        )

        if existing_count >= 1:
            raise HTTPException(
                status_code=400, detail="Note annotations can only have one message"
            )

    db_message = AnnotationMessage(annotation_id=annotation_id, **message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/{annotation_id}/messages", response_model=list[AnnotationMessageResponse])
def get_annotation_messages(
    annotation_id: int,
    include_deleted: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    query = db.query(AnnotationMessage).filter(AnnotationMessage.annotation_id == annotation_id)

    if not include_deleted:
        query = query.filter(AnnotationMessage.deleted_at.is_(None))

    return query.offset(skip).limit(limit).all()


@router.get("/messages/{message_id}", response_model=AnnotationMessageResponse)
def get_annotation_message(message_id: int, db: AsyncSession = Depends(get_db)):
    message = (
        db.query(AnnotationMessage)
        .filter(and_(AnnotationMessage.id == message_id, AnnotationMessage.deleted_at.is_(None)))
        .first()
    )

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    return message


@router.put("/messages/{message_id}", response_model=AnnotationMessageResponse)
def update_annotation_message(message_id: int, content: str, db: AsyncSession = Depends(get_db)):
    message = (
        db.query(AnnotationMessage)
        .filter(and_(AnnotationMessage.id == message_id, AnnotationMessage.deleted_at.is_(None)))
        .first()
    )

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    message.content = content
    db.commit()
    db.refresh(message)
    return message


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_annotation_message(message_id: int, db: AsyncSession = Depends(get_db)):
    message = (
        db.query(AnnotationMessage)
        .filter(and_(AnnotationMessage.id == message_id, AnnotationMessage.deleted_at.is_(None)))
        .first()
    )

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    message.deleted_at = datetime.utcnow()
    db.commit()
