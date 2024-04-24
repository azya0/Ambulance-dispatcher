
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.engine import get_async_session
from db.models import Call, Patient, StatusType
from routers.schemas import CallScheme, CallSchemeRead, StatusScheme, StatusSchemeRead


router = APIRouter(
    prefix="/call",
    tags=["call"],
)


@router.post('/status', response_model=StatusScheme)
async def post_status(data: StatusSchemeRead, session: AsyncSession = Depends(get_async_session)):
    status = StatusType(name=data.name)
    
    session.add(status)
    await session.commit()
    await session.refresh(status)

    return StatusScheme.model_validate(status)


@router.get('/status/{id}', response_model=StatusScheme)
async def get_status(id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(StatusType, id)

    if result is None:
        raise HTTPException(404, 'no status with such id')
    
    return StatusScheme.model_validate(result)


@router.get('/statuses', response_model=list[StatusScheme])
async def get_statuses(session: AsyncSession = Depends(get_async_session)):
    result = (await session.scalars(select(StatusType))).all()

    return [StatusScheme.model_validate(data) for data in result]


@router.delete('/status/{id}')
async def delete_status(id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(StatusType, id)

    if result is None:
        raise HTTPException(404, 'no status with such id')

    await session.delete(result)


@router.patch('/status/{id}', response_model=StatusScheme)
async def get_status(id: int, data: StatusSchemeRead, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(StatusType, id)

    if result is None:
        raise HTTPException(404, 'no status with such id')
    
    result.name = data.name
    session.add(result)
    await session.commit(result)
    await session.refresh(result)

    return StatusScheme.model_validate(result)


@router.post('/call', response_model=CallScheme)
async def post_call(data: CallSchemeRead, session: AsyncSession = Depends(get_async_session)):
    status = await session.get(StatusType, data.status.id)

    if status is None or data.status.name != status.name:
        raise HTTPException(400, 'wrong status')
    
    patient = Patient(**data.patient.model_dump())

    session.add(patient)
    await session.commit()
    await session.refresh(patient)

    call = Call(patient_id=patient.id, status_id=status.id)
    session.add(call)
    await session.commit()
    await session.refresh(call)

    return CallScheme(**vars(call), patient=patient, status=status)
