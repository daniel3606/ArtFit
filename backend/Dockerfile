FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir \
  django djangorestframework django-cors-headers django-filter \
  psycopg2-binary python-dotenv djangorestframework-simplejwt Pillow
COPY . /app
