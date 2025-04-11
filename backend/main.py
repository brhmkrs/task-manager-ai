from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models  # . yerine direkt import
import schemas  # . yerine direkt import
from database import SessionLocal, engine  # database.py'den mutlak import

# Veritabanı tablolarını oluştur
models.Base.metadata.create_all(bind=engine)

class TaskRequest(BaseModel):
    task: str
    
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Görev oluştur
@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(task=task.task, done=task.done)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# Tüm görevleri getir
@app.get("/tasks", response_model=list[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@app.post("/suggest")
def suggest_task(data: TaskRequest):
    task_text = data.task.lower()
    if "okuma" in task_text or "kitap" in task_text:
        return {"suggestions": ["Kitap özetini çıkar", "Benzer kitap oku", "Alıntıları not et"]}
    elif "spor" in task_text or "koşu" in task_text:
        return {"suggestions": ["Koşu süresini artır", "Egzersiz planı hazırla", "Protein takviyesi al"]}
    else:
        return {"suggestions": ["Görevi detaylandır", "Alt görevler oluştur", "Hatırlatıcı kur"]}