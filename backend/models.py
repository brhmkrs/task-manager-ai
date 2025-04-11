from sqlalchemy import Boolean, Column, Integer, String
from database import Base  # Absolute import

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    task = Column(String, index=True)
    done = Column(Boolean, default=False)