import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from db.engine import get_async_session
from db.models import Brigade, Brigade_xref_Worker, Car, Worker, Call
from routers.schemas import BrigadeSchemeFull, BrigadeSchemeFullShort, BrigadeSchemePatch, WorkerScheme


router = APIRouter(
    prefix="/brigade",
    tags=["brigade"],
)


@router.post('', response_model=BrigadeSchemeFull)
async def post_brigade(session: AsyncSession = Depends(get_async_session)):
    result = Brigade(start_time=datetime.datetime.now(), end_time=datetime.datetime.now())
    
    session.add(result)
    await session.commit()
    await session.refresh(result)

    return BrigadeSchemeFull(
        rating=0,
        id=result.id,
        start_time=result.start_time,
        end_time=result.end_time,
        workers=[],
        car=None
    )


@router.patch('/by_id/{id}', response_model=BrigadeSchemeFullShort)
async def patch_brigade(id: int, data: BrigadeSchemePatch, session: AsyncSession = Depends(get_async_session)):
    brigade = await session.get(Brigade, id, options=(selectinload(Brigade.car), selectinload(Brigade.workers), selectinload(Brigade.workers, Worker.post), selectinload(Brigade.call),))
    
    if brigade is None:
        raise HTTPException(404, 'no brigade with such id')

    result = BrigadeSchemeFullShort.model_validate(brigade)

    if data.call_id is not None:
        if data.call_id != -1:
            call = await session.get(Call, data.call_id)

            if call is None:
                raise HTTPException(400, 'wrong status id')
            
            brigade.call_id = call.id
            result.call = call
        else:
            brigade.call_id = None
            result.call = None
        
        session.add(brigade)

    if data.car is not None:
        car = await session.get(Car, data.car)

        if car is None:
            raise HTTPException(400, 'wrong car id')
    
        brigade.car_id = car.id
        session.add(brigade)
        result.car = car

    if data.workers is not None:
        new_worker_list, drivers = [], 0

        for worker_id in data.workers:
            worker = await session.get(Worker, worker_id, options=(selectinload(Worker.post), ))

            if worker is None:
                raise HTTPException(400, 'wrong worker id')

            if worker.post.is_driver:
                drivers += 1

            new_worker_list.append(worker)
        
        if len(new_worker_list) > 3:
            raise HTTPException(400, 'too many workers')

        if drivers == 0 and len(new_worker_list) != 0:
            raise HTTPException(400, 'no driver')

        if drivers > 1:
            raise HTTPException(400, 'too many drivers')

        for worker in brigade.workers:
            if worker in new_worker_list:
                continue

            request = select(Brigade_xref_Worker).where((Brigade_xref_Worker.brigade_id == brigade.id) & (Brigade_xref_Worker.worker_id == worker.id))
            connection = await session.scalar(request)
            await session.delete(connection)

        for worker in new_worker_list:
            if worker in brigade.workers:
                continue

            session.add(Brigade_xref_Worker(brigade_id=brigade.id, worker_id=worker.id))

        result.workers = list(map(lambda worker: WorkerScheme.model_validate(worker), new_worker_list))

    await session.commit()

    return result


@router.get('/by_id/{id}', response_model=BrigadeSchemeFullShort)
async def get_brigade_by_id(id: int, session: AsyncSession = Depends(get_async_session)):
    data = await session.get(Brigade, id, options=(selectinload(Brigade.car), selectinload(Brigade.workers), selectinload(Brigade.workers, Worker.post), selectinload(Brigade.call), ))

    if data is None:
        raise HTTPException(404, 'no brigade found')
    
    return BrigadeSchemeFullShort.model_validate(data)


@router.get('/all', response_model=list[BrigadeSchemeFullShort])
async def get_brigades(session: AsyncSession = Depends(get_async_session)):
    request = select(Brigade).options(selectinload(Brigade.car), selectinload(Brigade.workers), selectinload(Brigade.workers, Worker.post), selectinload(Brigade.call), )
    result = (await session.scalars(request)).all()

    return [BrigadeSchemeFullShort.model_validate(data) for data in result]


@router.delete('/by_id/{id}')
async def delete_brigade_by_id(id: int, session: AsyncSession = Depends(get_async_session)):
    brigade = await session.get(Brigade, id)

    if brigade is None:
        raise HTTPException(404, 'no brigade found')
    
    xrefs = (await session.scalars(select(Brigade_xref_Worker).where(Brigade_xref_Worker.brigade_id == brigade.id))).all()

    for xref in xrefs:
        await session.delete(xref)
    
    await session.delete(brigade)


@router.patch('/score/{score}/by_id/{id}')
async def patch_score(id: int, score: int, session: AsyncSession = Depends(get_async_session)):
    brigade = await session.get(Brigade, id)

    if brigade is None:
        raise HTTPException(404, 'no brigade with such id')
    
    brigade.rating = score
    session.add(brigade)
    await session.commit()
