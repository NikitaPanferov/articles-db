from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

from routers.auth_router import router as auth_router
from routers.article_router import router as article_router
from models import db


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await db.dispose()


app = FastAPI(
    lifespan=lifespan,
    default_response_class=ORJSONResponse,
)

app.include_router(auth_router)
app.include_router(article_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping", tags=["test"])
async def ping():
    return {"message": "pong"}


# app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")


# # Маршрут для главной страницы
# @app.get("/")
# async def read_index():
#     return FileResponse("dist/index.html")


# # Маршрут для всех остальных страниц (для поддержки React Router)
# @app.get("/{full_path:path}")
# async def read_react_app(full_path: str):
#     return FileResponse("dist/index.html")


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
