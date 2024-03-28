FROM python:3.10-slim

COPY requirement.txt ./backend/requirement.txt

RUN pip install --upgrade pip

RUN pip install -r ./backend/requirement.txt

COPY . ./backend

WORKDIR /backend
