FROM python:3

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt update -y
RUN apt install netcat -y

RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
