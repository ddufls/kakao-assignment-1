from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

DATABASE_URL = "sqlite:///./todos.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    date = Column(String, nullable=False)

class TodoCreate(BaseModel):
    text: str
    completed: bool = False
    date: str


class TodoUpdate(BaseModel):
    text: str
    completed: bool
    date: str
    
Base.metadata.create_all(bind=engine)
    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.get("/todos")
def get_todos(
    filter: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Todo)

    if filter == "active":
        query = query.filter(Todo.completed == False)

    elif filter == "completed":
        query = query.filter(Todo.completed == True)

    if search:
        query = query.filter(
            Todo.text.contains(search)
        )

    return query.all()

@app.post("/todos")
def create_todo(todo: TodoCreate,
                db: Session = Depends(get_db)):
    new_todo = Todo(
        text=todo.text,
        completed=todo.completed,
        date=todo.date,
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo

@app.put("/todos/{todo_id}")
def update_todo(
    todo_id: int,
    todo: TodoUpdate,
    db: Session = Depends(get_db)
):
    db_todo = db.query(Todo).filter(
        Todo.id == todo_id
    ).first()

    if not db_todo:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    db_todo.text = todo.text
    db_todo.completed = todo.completed
    db_todo.date = todo.date

    db.commit()
    db.refresh(db_todo)

    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    db_todo = db.query(Todo).filter(
        Todo.id == todo_id
    ).first()

    if not db_todo:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    db.delete(db_todo)
    db.commit()

    return {"message": "Todo deleted"}

@app.get("/")
def root():
    return {"message": "Hello World"}