from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.engine import get_async_session
from db.models import Brigade, Car
from routers.schemas import CarScheme, CarSchemeRead


router = APIRouter(
    prefix="/car",
    tags=["car"],
)


@router.post('', response_model=CarScheme)
async def post_car(data: CarSchemeRead, session: AsyncSession = Depends(get_async_session)):
    result = Car(**data.model_dump())

    session.add(result)
    await session.commit()
    await session.refresh(result)

    return result


@router.get('/get_by_id/{id}', response_model=CarScheme)
async def get_car(id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(Car, id)

    if result is None:
        raise HTTPException(404, 'no car with such id')
    
    return CarScheme.model_validate(result)


@router.get('/all', response_model=list[CarScheme])
async def get_cars(session: AsyncSession = Depends(get_async_session)):
    result = (await session.scalars(select(Car))).all()

    return [CarScheme.model_validate(data) for data in result]


@router.delete('/get_by_id/{id}')
async def delete_car(id: int, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(Car, id)

    if result is None:
        raise HTTPException(404, 'no car with such id')

    await session.delete(result)


@router.patch('/get_by_id/{id}', response_model=CarScheme)
async def get_car(id: int, data: CarSchemeRead, session: AsyncSession = Depends(get_async_session)):
    result = await session.get(Car, id)

    if result is None:
        raise HTTPException(404, 'no car with such id')
    
    result.model = data.model

    session.add(result)
    await session.commit(result)
    await session.refresh(result)

    return CarScheme.model_validate(result)


@router.get('/free', response_model=list[CarScheme])
async def get_free_cars(session: AsyncSession = Depends(get_async_session)):
    request = select(Car).filter(~Car.id.in_(select(Brigade.car_id)))

    result = (await session.scalars(request)).all()

    return result
