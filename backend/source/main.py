from fastapi import FastAPI
from config import get_settings

from routers import __all__ as routers


def get_application(settings):
    application = FastAPI(
        title='db_projct',
        version='dev',
        debug=True,
    )

    for router in routers:
        application.include_router(router)

    return application


app = get_application(get_settings())
