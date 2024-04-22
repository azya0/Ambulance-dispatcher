import datetime

from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import as_declarative, relationship


@as_declarative()
class Base:
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)

# group = relationship("Group", back_populates='students', uselist=False)
# subjects = relationship("Subject", secondary='specialization_xref_subject', back_populates='specializations', uselist=True)


@as_declarative()
class Human:
    first_name = Column(String(64), nullable=False)
    second_name = Column(String(64), nullable=False)
    patronymic = Column(String(64), nullable=True)


class Worker(Base, Human):
    __tablename__ = 'worker'

    is_ill = Column(Boolean, default=False)
    post_id = Column(Integer, ForeignKey('post.id'), nullable=False)

    post = relationship("Post", back_populates="workers", uselist=False)

class Post(Base):
    __tablename__ = 'post'

    name = Column(String(128), nullable=False)
    is_driver = Column(Boolean, default=False)

    workers = relationship("Worker", back_populates="post")


class Car(Base):
    __tablename__ = 'car'

    model = Column(String(128), nullable=False)


class Call(Base):
    __tablename__ = 'call'

    patient_id = Column(Integer, ForeignKey('patient.id'), nullable=False)
    brigade_id = Column(Integer, ForeignKey('brigade.id'), nullable=True)
    status_id = Column(Integer, ForeignKey('status_type.id'), nullable=False)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())
    end_at = Column(DateTime, nullable=True)


class Brigade(Base):
    __tablename__ = 'brigade'

    start_time = Column(
        DateTime,
        server_default=func.now(),
        server_onupdate=func.now(),
        onupdate=datetime.datetime.now
    )
    end_time = Column(DateTime, server_default=func.now())


class Brigade_xref_Worker(Base):
    __tablename__ = 'brigade_xref_worker'

    brigade_id = Column(Integer, ForeignKey('brigade.id'), nullable=False)
    worker_id = Column(Integer, ForeignKey('worker.id'), nullable=False)


class StatusType(Base):
    __tablename__ = 'status_type'

    name = Column(String(32), nullable=False)


class Patient(Base, Human):
    __tablename__ = 'patient'

    adress = Column(String(128), nullable=True)


class Patient_xref_Symptom(Base):
    __tablename__ = 'patient_xref_symptom'

    patient_id = Column(Integer, ForeignKey('patient.id'), nullable=False)
    symptom_id = Column(Integer, ForeignKey('symptom.id'), nullable=False)
    call_id = Column(Integer, ForeignKey('call.id'), nullable=False)


class Symptom(Base):
    __tablename__ = 'symptom'

    name = Column(String(64), nullable=False)
