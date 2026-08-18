from sqlalchemy import create_engine

DATABASE_URL = "mysql+pymysql://root:S1352859ip!@localhost/university"

engine = create_engine(DATABASE_URL)