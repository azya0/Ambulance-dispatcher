import datetime
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
    fired_at: datetime.datetime | None

    class Config:
        from_attributes = True


class CarSchemeRead(BaseModel):
    model: str


class CarScheme(CarSchemeRead, ID):
    class Config:
        from_attributes = True


class CarFullScheme(CarSchemeRead, ID):
    used: bool

    class Config:
        from_attributes = True


class BrigadeSchemeRead(BaseModel):
    workers: list[int]
    car_id: int
    start_time: datetime.datetime
    end_time: datetime.datetime


class StatusSchemeRead(BaseModel):
    name: str


class StatusScheme(StatusSchemeRead, ID):
    class Config:
        from_attributes = True


class StatusSchemeFull(StatusSchemeRead, ID):
    used: bool

    class Config:
        from_attributes = True


class PatientSchemeRead(HumanScheme):
    address: str
    descriptions: str


class PatientScheme(PatientSchemeRead, ID):
    class Config:
        from_attributes = True



class PatientSchemePatch(BaseModel):
    first_name: str | None = None
    second_name: str | None = None
    patronymic: str | None = None

    address: str | None = None
    descriptions: str | None = None


class CallSchemeRead(BaseModel):
    patient: PatientSchemeRead
    status: StatusScheme


class CallPatchScheme(BaseModel):
    patient: PatientSchemePatch | None = None
    status_id: int | None = None


class BrigadeScheme(BaseModel):
    id: int
    rating: int

    car: CarScheme | None
    start_time: datetime.datetime
    end_time: datetime.datetime
    
    workers: list[WorkerScheme]

    class Config:
        from_attributes = True


class CallScheme(BaseModel, ID):
    status: StatusScheme
    patient: PatientScheme

    brigade: BrigadeScheme | None = None

    created_at: datetime.datetime
    updated_at: datetime.datetime
    end_at: datetime.datetime | None = None

    class Config:
        from_attributes = True



class BrigadeSchemeExtraShort(BaseModel):
    id: int

    class Config:
        from_attributes = True


class CallSchemeBrigadeShort(BaseModel, ID):
    status: StatusScheme
    patient: PatientScheme

    brigade: BrigadeSchemeExtraShort | None = None

    created_at: datetime.datetime
    updated_at: datetime.datetime
    end_at: datetime.datetime | None = None

    class Config:
        from_attributes = True


class CallSchemeShort(BaseModel, ID):
    status: StatusScheme
    patient: PatientScheme

    created_at: datetime.datetime
    updated_at: datetime.datetime
    end_at: datetime.datetime | None = None

    class Config:
        from_attributes = True


class CallSchemeExtremeShort(BaseModel, ID):
    class Config:
        from_attributes = True


class BrigadeSchemeFullShort(BrigadeScheme):
    call: CallSchemeExtremeShort | None = None
    rating: int

    class Config:
        from_attributes = True


class BrigadeSchemeFull(BrigadeScheme):
    call: CallSchemeShort | None = None


class BrigadeSchemeReadShort(BaseModel):
    start_time: datetime.datetime
    end_time: datetime.datetime


class BrigadeSchemePatch(BaseModel):
    call_id: int | None = None
    car: int | None = None
    workers: list[int] | None = None
