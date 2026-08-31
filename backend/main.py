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
   query = text("SELECT *, SUM(amount) OVER (ORDER BY date, id) AS running_balance FROM finance ORDER BY date desc, id desc")

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

@app.get("/showexpenses")
def show_expenses():
   query = text(
       """with caltotal as(select category, sum(case when amount < 0 then amount end)as total 
        from finance group by category having total is not null),
        calrank as (select category , total, row_number() over(order by total)as ranks 
        from caltotal order by ranks),
        setcate as(select (case when ranks > 4 then 'other' else category end) as cate, total
        from calrank)
        select cate as category,abs(sum(total))AS total, ROW_NUMBER() OVER (
        ORDER BY CASE WHEN cate = 'other' THEN 1 ELSE 0 END, ABS(SUM(total)) DESC
		) AS final_rank from setcate group by cate order by final_rank """
   )

   with engine.connect() as connection:
       result = connection.execute(query)

   return [
       {
           "category": row.category,
           "total": float(row.total) if row.total is not None else 0,
       }
       for row in result
   ]

@app.get("/showincomes")
def show_incomes():
   query = text(
       """with caltotal as(select category, sum(case when amount > 0 then amount end)as total 
        from finance group by category having total is not null),
        calrank as (select category , total, row_number() over(order by total)as ranks 
        from caltotal order by ranks),
        setcate as(select (case when ranks > 4 then 'other' else category end) as cate, total
        from calrank)
        select cate as category,abs(sum(total))AS total, ROW_NUMBER() OVER (
        ORDER BY CASE WHEN cate = 'other' THEN 1 ELSE 0 END, ABS(SUM(total)) DESC
		) AS final_rank from setcate group by cate order by final_rank """
   )

   with engine.connect() as connection:
       result = connection.execute(query)

   return [
       {
           "category": row.category,
           "total": float(row.total) if row.total is not None else 0,
       }
       for row in result
   ]

@app.get("/getbudget")
def get_budget():
   query = text("""with calsum as (select category, sum(case when amount < 0 then amount end)as total
    from finance group by category having total is not null)
    select budgets.category, budgets.budget_amount, ABS(COALESCE(calsum.total, 0))as total,
    budgets.budget_amount + COALESCE(calsum.total, 0) AS remaining
    from budgets  left join calsum
    on calsum.category = budgets.category""")

   with engine.connect() as connection:
       result = connection.execute(query)
       budget_data = [
           {
               "category": row.category,
               "budget_amount": row.budget_amount,
               "spent": row.total,
               "remaining":row.remaining
           }
           for row in result
       ]

   return budget_data
@app.post("/transactions")
def add_transaction(payload: TransactionList):
   if not payload.transactions:
       raise HTTPException(status_code=400, detail="No transactions provided")
   with engine.begin() as connection:
       for transaction in payload.transactions:
           query = text(
               "INSERT INTO finance (date, amount, category) VALUES (:date, :amount, :category)"
           )
           connection.execute(query, {"date": transaction.date, "amount": transaction.amount, "category": transaction.category})
   return {"message": "Transaction added successfully"}

@app.post("/addbudget")
def add_budget(payload: dict):
   category = payload.get("category")
   budget_amount = payload.get("budget_amount")

   if not category or budget_amount is None:
       raise HTTPException(status_code=400, detail="Category and budget amount are required")

   with engine.begin() as connection:
       query = text(
           "INSERT INTO budgets (category, budget_amount) VALUES (:category, :budget_amount)"
       )
       connection.execute(query, {"category": category, "budget_amount": budget_amount})

   return {"message": "Budget added successfully"}