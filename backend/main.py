from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


app = FastAPI()

# CORS ekle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme için herkese açık
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    task: str

@app.post("/suggest")
def suggest_task(data: TaskRequest):
    task_text = data.task.lower()
    
    # Basit öneriler (ileride AI ile geliştirilecek)
    if "okuma" in task_text or "kitap" in task_text:
        return {"suggestions": ["Kitap özetini çıkar", "Benzer kitap oku", "Alıntıları not et"]}
    elif "spor" in task_text or "koşu" in task_text:
        return {"suggestions": ["Koşu süresini artır", "Egzersiz planı hazırla", "Protein takviyesi al"]}
    else:
        return {"suggestions": ["Görevi detaylandır", "Alt görevler oluştur", "Hatırlatıcı kur"]}
