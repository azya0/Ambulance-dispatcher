
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from db.engine import get_async_session
from db.models import Brigade, Call, Patient, StatusType
from routers.schemas import CallPatchScheme, CallScheme, CallSchemeRead, StatusScheme, StatusSchemeFull, StatusSchemeRead


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


@router.get('/statuses/full', response_model=list[StatusSchemeFull])
async def get_statuses(session: AsyncSession = Depends(get_async_session)):
    result = (await session.scalars(select(StatusType).options(selectinload(StatusType.calls), ))).all()

    return [StatusSchemeFull(**vars(data), used=bool(data.calls)) for data in result]


@router.delete('/status/{id}')
async def delete_status(id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(StatusType, id, options=(selectinload(StatusType.calls), ))

    if result is None:
        raise HTTPException(404, 'no status with such id')

    if result.calls:
        raise HTTPException(409, 'status is uses in call')

    await session.delete(result)


@router.patch('/status/{id}', response_model=StatusScheme)
async def get_status(id: int, data: StatusSchemeRead, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(StatusType, id)

    if result is None:
        raise HTTPException(404, 'no status with such id')
    
    result.name = data.name
    session.add(result)
    await session.commit()
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


@router.get('/calls', response_model=list[CallScheme])
async def get_calls(session: AsyncSession = Depends(get_async_session)):
    return (await session.scalars(select(Call).where(Call.end_at == None).options(selectinload(Call.patient), selectinload(Call.status), selectinload(Call.brigade), ))).all()


@router.patch('/call/{call_id}', response_model=CallScheme)
async def patch_call(call_id: int, data: CallPatchScheme, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(Call, call_id, options=(selectinload(Call.patient), selectinload(Call.status), selectinload(Call.brigade), ))
    has_change = False

    if data.descriptions is not None:
        result.patient.descriptions = data.descriptions

        session.add(result.patient)
        await session.commit()
        await session.refresh(result.patient)

        has_change = True

    if data.status_id is not None:
        status = await session.get(StatusType, data.status_id)

        if status is None:
            raise HTTPException(404, 'wrong status id')
        
        result.status_id = status.id
        result.status = status

        has_change = True

    if has_change:
        result.updated_at = datetime.datetime.now()
        session.add(result)
        await session.commit()
        await session.refresh(result)

    return result

@router.delete('/call/close/{call_id}')
async def close_call(call_id: int, session: AsyncSession = Depends(get_async_session)):
    closed = await session.get(Call, call_id, options=(selectinload(Call.patient), selectinload(Call.brigade), ))

    if closed.brigade is not None:
        brigade = await session.get(Brigade, closed.brigade.id)
        brigade.call_id = None
        
        session.add(brigade)
        await session.commit()

    closed.updated_at = closed.end_at = datetime.datetime.now()
    
    session.add(closed)
    await session.commit()
