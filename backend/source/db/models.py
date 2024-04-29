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
    brigade = relationship("Brigade", secondary='brigade_xref_worker', back_populates='workers', uselist=False)


class Post(Base):
    __tablename__ = 'post'

    name = Column(String(128), nullable=False)
    is_driver = Column(Boolean, default=False)

    workers = relationship("Worker", back_populates="post")


class Car(Base):
    __tablename__ = 'car'

    model = Column(String(128), nullable=False)

    brigade = relationship("Brigade", back_populates="car", uselist=False)


class Brigade(Base):
    __tablename__ = 'brigade'

    call_id = Column(Integer, ForeignKey('call.id'), nullable=True, default=None)
    car_id = Column(Integer, ForeignKey('car.id'), nullable=False)

    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)

    car = relationship("Car", back_populates="brigade", uselist=False)
    workers = relationship("Worker", secondary='brigade_xref_worker', back_populates='brigade', uselist=True)
    call = relationship("Call", back_populates="brigade", uselist=False)


class Brigade_xref_Worker(Base):
    __tablename__ = 'brigade_xref_worker'

    brigade_id = Column(Integer, ForeignKey('brigade.id'), nullable=False)
    worker_id = Column(Integer, ForeignKey('worker.id'), nullable=False)


class Call(Base):
    __tablename__ = 'call'

    patient_id = Column(Integer, ForeignKey('patient.id'), nullable=False)
    status_id = Column(Integer, ForeignKey('status_type.id'), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    end_at = Column(DateTime(timezone=True), nullable=True)

    patient = relationship("Patient", back_populates="call", uselist=False)
    status = relationship("StatusType", back_populates="calls", uselist=False)
    brigade = relationship("Brigade", back_populates="call", uselist=False)


class Patient(Base, Human):
    __tablename__ = 'patient'

    address = Column(String(256), nullable=False)
    descriptions = Column(String(512), nullable=False)

    call = relationship("Call", back_populates="patient", uselist=False)


class StatusType(Base):
    __tablename__ = 'status_type'

    name = Column(String(32), nullable=False, unique=True)
    is_system_closed = Column(Boolean, nullable=False, default=False)

    calls = relationship("Call", back_populates="status")
