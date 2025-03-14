from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

__all__ = ["DB_URL", "ENGINE", "ArisSession"]

DB_URL = "postgresql://leo.torres@localhost:5432/aris"
ENGINE = create_engine(DB_URL)
ArisSession = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)
