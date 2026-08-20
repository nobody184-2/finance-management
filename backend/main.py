from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from db import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/finance")
def get_finance_data():
    query = text("SELECT * FROM finance ORDER BY date ASC")

    with engine.connect() as connection:
        result = connection.execute(query)
        finance_data = [
            {
                "id": row.id,
                "date": row.date,
                "amount": row.amount,
                "type": row.type,
            }
            for row in result
        ]

    return finance_data


@app.get("/incomes")
def get_incomes():
    query = text("SELECT COALESCE(SUM(amount), 0) FROM finance WHERE amount > 0")

    with engine.connect() as connection:
        result = connection.execute(query)
        value = result.scalar()

    return float(value) if value is not None else 0


@app.get("/expenses")
def get_expenses():
    query = text("SELECT COALESCE(SUM(amount), 0) FROM finance WHERE amount < 0")

    with engine.connect() as connection:
        result = connection.execute(query)
        value = result.scalar()

    return float(value) if value is not None else 0


@app.get("/balance")
def get_balance():
    query = text("SELECT COALESCE(SUM(amount), 0) FROM finance")

    with engine.connect() as connection:
        result = connection.execute(query)
        value = result.scalar()

    return float(value) if value is not None else 0


@app.get("/daybalance")
def get_day_balance():
    query = text(
        "SELECT date, SUM(amount) AS total FROM finance GROUP BY date ORDER BY date ASC"
    )

    with engine.connect() as connection:
        result = connection.execute(query)

    return [
        {
            "date": row.date,
            "total": float(row.total) if row.total is not None else 0,
        }
        for row in result
    ]
