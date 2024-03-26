from pydantic import BaseModel


class ID:
    id: int


class PostScheme(BaseModel, ID):
    name: str

    class Config:
        from_attributes = True


class HumanScheme(BaseModel):
    first_name: str
    second_name: str
    patronymic: str | None = None


class WorkerSchemeRead(HumanScheme):
    post_id: int


class WorkerScheme(HumanScheme, ID):
    post: PostScheme
    is_ill: bool

    class Config:
        from_attributes = True
