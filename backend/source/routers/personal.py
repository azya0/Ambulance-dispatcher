import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from db.models import Brigade_xref_Worker, Post, Worker
from db.engine import get_async_session
from routers.schemas import PostScheme, PostSchemePatch, WorkerScheme, WorkerSchemePatch, WorkerSchemeRead

router = APIRouter(
    prefix="/personal",
    tags=["personal"],
)


@router.get('/post/{id}', response_model=PostScheme)
async def get_post_by_id(id: int, session: AsyncSession = Depends(get_async_session)):
    post = await session.get(Post, id)

    if post is None:
        raise HTTPException(404, f'post with id {id} not found')

    return PostScheme.model_validate(post)


@router.patch('/post/{id}', response_model=PostScheme)
async def patch_post_by_id(id: int, data: PostSchemePatch, session: AsyncSession = Depends(get_async_session)):
    post = await session.get(Post, id)

    if post is None:
        raise HTTPException(404, f'post with id {id} not found')

    for key in (data := data.model_dump(exclude_none=True)):
        setattr(post, key, data[key])

    session.add(post)
    await session.commit()
    await session.refresh(post)

    return PostScheme.model_validate(post)


@router.delete('/post/{id}')
async def delete_post_by_id(id: int, session: AsyncSession = Depends(get_async_session)):
    post = await session.get(Post, id)

    if post is None:
        raise HTTPException(404, f'post with id {id} not found')

    worker = (await session.scalars(select(Worker).where(Worker.post_id == id))).first()

    if worker is not None:
        raise HTTPException(409, f'post is used at least by user {worker.id}')

    await session.delete(post)


@router.get('/posts', response_model=list[PostScheme])
async def get_posts(session: AsyncSession = Depends(get_async_session)):
    data = (await session.scalars(select(Post))).all()

    return [PostScheme.model_validate(value) for value in data]


@router.post('/post', response_model=PostScheme)
async def add_post(post_name: str, session: AsyncSession = Depends(get_async_session)):
    already = (await session.scalars(select(Post).where(Post.name == post_name))).first()

    if already is not None:
        raise HTTPException(400, f'post {post_name} already exist')
    
    new_post: Post = Post(name=post_name)

    session.add(new_post)
    await session.commit()
    await session.refresh(new_post)

    return PostScheme.model_validate(new_post)


@router.post('/worker', response_model=WorkerScheme)
async def add_worker(data: WorkerSchemeRead, session: AsyncSession = Depends(get_async_session)):
    post = await session.get(Post, data.post_id)

    if post is None:
        raise HTTPException(404, f'post with id {data.post_id} not found')
    
    worker = Worker(**data.model_dump())

    session.add(worker)
    await session.commit()
    await session.refresh(worker)

    result = WorkerScheme.model_validate(worker)
    result.post = PostScheme.model_validate(post)
    
    return result

@router.get('/worker/{id}', response_model=WorkerScheme)
async def get_worker_by_id(id: int, session: AsyncSession = Depends(get_async_session)):
    worker = await session.get(Worker, id, options=(selectinload(Worker.post), ))

    if worker is None:
        raise HTTPException(404, f'no worker with id {id}')

    return WorkerScheme.model_validate(worker)


@router.patch('/worker/{id}', response_model=WorkerScheme)
async def patch_worker_by_id(id: int, data: WorkerSchemePatch, session: AsyncSession = Depends(get_async_session)):
    worker = await session.get(Worker, id, options=(selectinload(Worker.post), ))

    if worker is None:
        raise HTTPException(404, f'no worker with id {id}')

    if data.post_id is not None:
        post = await session.get(Post, data.post_id)

        if post is None:
            raise HTTPException(400, f'post with id {data.post_id} not found')

    for key in (data := data.model_dump(exclude_none=True)):
        setattr(worker, key, data[key])

    session.add(worker)
    await session.commit()
    await session.refresh(worker)

    return WorkerScheme.model_validate(worker)


@router.delete('/worker/{id}')
async def delete_worker_by_id(id: int, session: AsyncSession = Depends(get_async_session)):
    worker = await session.get(Worker, id)

    if worker is None:
        raise HTTPException(404, f'no worker with id {id}')
    
    worker.fired_at = datetime.datetime.now()
    session.add(worker)
    await session.commit()


@router.get('/workers', response_model=list[WorkerScheme])
async def get_workers(session: AsyncSession = Depends(get_async_session)):
    workers = (await session.scalars(select(Worker).where(Worker.fired_at == None).options(selectinload(Worker.post)))).all()

    return [WorkerScheme.model_validate(worker) for worker in workers]


@router.get('/workers/free', response_model=list[WorkerScheme])
async def get_free_workers(session: AsyncSession = Depends(get_async_session)):

    request = select(Worker).where((Worker.is_ill == False) & (Worker.fired_at == None)).outerjoin(
        Brigade_xref_Worker, Worker.id == Brigade_xref_Worker.worker_id).filter(
        (Brigade_xref_Worker.id == None)).options(selectinload(Worker.post), )

    return [WorkerScheme.model_validate(worker) for worker in (await session.scalars(request)).all()]
