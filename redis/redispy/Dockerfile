# Use an official Python image.
# https://hub.docker.com/_/python
FROM python:3.9

WORKDIR /usr/src/app/

RUN pwd

COPY . .

RUN pip install -r requirements.txt

# Copy local code to the container image.

# Service must listen to $PORT environment variable.
# This default value facilitates local development.
ENV PORT 8080

# Setting this ensures print statements and log messages
# promptly appear in Cloud Logging.
ENV PYTHONUNBUFFERED TRUE

RUN python3 server/manage.py collectstatic

CMD exec python3 server/manage.py runserver 0.0.0.0:$PORT
