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



@app.get("/finance")
def get_finance_data():

    query = text("SELECT * FROM finance")

    with engine.connect() as connection:
        result = connection.execute(query)

        finance_data = []

        for row in result:
            finance_data.append({
                "id": row.id,
                "date": row.date,
                "amount": row.amount,
                "type": row.type
            })

    return finance_data

@app.get("/incomes")
def get_incomes():
    query = text("SELECT sum(amount) FROM finance WHERE amount > 0")

    with engine.connect() as connection:
        result = connection.execute(query)

        

    return result.scalar() or 0

@app.get("/expenses")
def get_expenses():
    query = text("SELECT sum(amount) FROM finance WHERE amount < 0")

    with engine.connect() as connection:
        result = connection.execute(query)

        

    return result.scalar() or 0

@app.get("/balance")
def get_balance():
    query = text("SELECT sum(amount) FROM finance")

    with engine.connect() as connection:
        result = connection.execute(query)

        

    return result.scalar() or 0