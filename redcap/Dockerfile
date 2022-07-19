FROM python:3.8.3-slim-buster

ENV TINI_VERSION="v0.19.0"


RUN pip install -U \
    pip \
    setuptools \
    wheel

WORKDIR /project

RUN useradd -m -r user && \
    chown user /project

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .
COPY ../frontend/schema ../frontend/schema 

USER user

ENV FLASK_APP=server
ENV PYTHONUNBUFFERED=1
EXPOSE 5000

ENTRYPOINT ["flask", "run", "--host=0.0.0.0"]