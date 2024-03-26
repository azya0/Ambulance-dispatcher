FROM python:3.10-slim

COPY requirements.txt ./server/backend/requirements.txt

RUN pip install --upgrade pip

RUN pip install -r /server/backend/requirements.txt

COPY . ./server/backend

WORKDIR /server/backend
