from pydantic import BaseModel


class ID:
    id: int


class PostScheme(BaseModel, ID):
    name: str
    is_driver: bool

    class Config:
        from_attributes = True


class PostSchemePatch(BaseModel):
    name: str | None = None
    is_driver: bool | None = None


class HumanScheme(BaseModel):
    first_name: str
    second_name: str
    patronymic: str | None = None


class WorkerSchemeRead(HumanScheme):
    post_id: int


class WorkerSchemePatch(BaseModel):
    first_name: str | None = None
    second_name: str | None = None
    patronymic: str | None = None
    post_id: int | None = None
    is_ill: bool | None = None


class WorkerScheme(HumanScheme, ID):
    post: PostScheme
    is_ill: bool

    class Config:
        from_attributes = True
