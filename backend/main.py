from datetime import date

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import inspect, select, text

from db import engine

app = FastAPI()

app.add_middleware(
   CORSMiddleware,
   allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)


class Transaction(BaseModel):
   date: date
   amount: float
   category: str = ""


class TransactionList(BaseModel):
   transactions: list[Transaction]


@app.get("/finance")
def get_finance_data():
   query = text("SELECT *, SUM(amount) OVER (ORDER BY date, id) AS running_balance FROM finance ORDER BY date desc, id asc")

   with engine.connect() as connection:
       result = connection.execute(query)
       finance_data = [
           {
               "id": row.id,
               "date": row.date,
               "amount": row.amount,
               "category": row.category,
               "running_balance": row.running_balance,
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
       "select date, sum(daily_amount) over(order by date)as total from (select date, sum(amount)as daily_amount from finance group by date)as s order by date"
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


@app.post("/transactions")
def add_transaction(payload: TransactionList):
   if not payload.transactions:
       raise HTTPException(status_code=400, detail="No transactions provided")
   inspector = inspect(engine)
   columns = {column["name"] for column in inspector.get_columns("finance")}
   with engine.begin() as connection:
       for transaction in payload.transactions:
           query = text(
               "INSERT INTO finance (date, amount, category) VALUES (:date, :amount, :category)"
           )
           connection.execute(query, {"date": transaction.date, "amount": transaction.amount, "category": transaction.category})
   return {"message": "Transaction added successfully"}