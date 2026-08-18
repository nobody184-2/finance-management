from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from db import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/students")
def get_students():

    query = text("SELECT * FROM students")

    with engine.connect() as connection:
        result = connection.execute(query)

        students = []

        for row in result:
            students.append({
                "id": row.id,
                "name": row.name,
                "age": row.age,
                "grade": row.grade
            })

    return students