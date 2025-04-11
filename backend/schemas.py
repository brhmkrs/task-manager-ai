from pydantic import BaseModel

class TaskBase(BaseModel):
    task: str
    done: bool = False

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int

    class Config:
        orm_mode = True