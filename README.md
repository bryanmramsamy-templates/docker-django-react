# Docker-Django-Graphene-React stack

Author: *Bryan M. Ramsamy*

This README will be completed soon...

## dev.env example

```env
# Django

DEBUG="1"
SECRET_KEY="secret_key"  # Must be generated: https://djecrety.ir/

DJANGO_ALLOWED_HOSTS="*"

DATABASE_ENGINE="django.db.backends.postgresql"
DATABASE_NAME="postgres"
DATABASE_USER="postgres"
DATABASE_PASSWORD="postgres"
DATABASE_HOST="db"
DATABASE_PORT="5432"

JWT_EXPIRATION_DELTA="5"  # In minutes
JWT_REFRESH_EXPIRATION_DELTA="7"  # In days


# PostgreSQL

DATABASE="postgres"

POSTGRES_DB="postgres"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"


# React

CHOKIDAR_USEPOLLING=true

REACT_APP_NAME="myApp"  # Must contain the app name
REACT_APP_BACKEND_SERVICE_PORT="8000"
REACT_APP_JWT_EXPIRATION_DELTA=${JWT_EXPIRATION_DELTA}
```
