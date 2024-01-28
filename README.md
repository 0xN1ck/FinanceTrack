<img src="finance_track_frontend/src/assets/img/brand/finance-track.png" alt="FinanceTrack Logo" style="display: block; margin: 0 auto;">

FinanceTrack представляет собой проект для учета данных работников для администраторов и для просмотра своей работы обычными пользователями.

## Структура проекта

### Бэкенд

- **Dockerfile-dev**: Dockerfile для разработки бэкенда.
- **Dockerfile-prod**: Dockerfile для продакшн бэкенда.
- **FinanceTrack/**: Каталог с основными файлами Django приложения.
- **db.sqlite3**: Файл базы данных SQLite.
- **entrypoint-dev.sh**: Сценарий входа для разработки.
- **entrypoint-prod.sh**: Сценарий входа для продакшна.
- **manage.py**: Основной скрипт управления Django.
- **record/**: Приложение Django для записей.
- **requirements.txt**: Файл с зависимостями Python.

### Фронтенд

- **.npmrc**: Файл настроек npm.
- **Dockerfile-dev**: Dockerfile для разработки фронтенда.
- **Dockerfile-prod**: Dockerfile для продакшн фронтенда.
- **jsconfig.json**: Файл настроек JavaScript.
- **nginx/**: Каталог с конфигурацией Nginx.
- **package-lock.json**: Файл зависимостей npm.
- **package.json**: Файл настроек npm.
- **public/**: Каталог с публичными файлами фронтенда.
- **src/**: Каталог с исходным кодом фронтенда.

## Установка и использование

1. **Необходимо создать файлы .env**

- `./finance_track_backend/.env.dev`
- `./finance_track_frontend/.env.development`
- `./finance_track_backend/.env.prod`
- `./finance_track_frontend/.env.production`
- `.env.dev.db`
- `.env.prod.db`

#### Пример структуры .env файлов

----- finance_track_backend/.env.dev -----
```
DEBUG=1\
SECRET_KEY=example-secret-key\
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 172.*.*.* [::1]\
CORS_CSRF_ORIGINS=http://localhost:3000 http://127.0.0.1:3000 http://localhost http://127.0.0.1 http://localhost:8000 http://127.0.0.1:8000\
SQL_ENGINE=django.db.backends.postgresql\
SQL_DATABASE=FinanceTrackDev\
SQL_USER=example_user\
SQL_PASSWORD=example_password\
SQL_HOST=db-dev\
SQL_PORT=5432
```

----- finance_track_backend/.env.prod -----
```
DEBUG=0\
SECRET_KEY=example-secret-key\
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]\
CORS_CSRF_ORIGINS=http://localhost http://127.0.0.1\
SQL_ENGINE=django.db.backends.postgresql\
SQL_DATABASE=FinanceTrackProd\
SQL_USER=example_user\
SQL_PASSWORD=example_password\
SQL_HOST=db-prod\
SQL_PORT=5432
```
----- .env.dev.db -----

```
POSTGRES_USER=example_user\
POSTGRES_PASSWORD=example_password\
POSTGRES_DB=FinanceTrackDev
```

----- .env.prod.db -----
```
POSTGRES_USER=example_user\
POSTGRES_PASSWORD=example_password\
POSTGRES_DB=FinanceTrackProd
```
----- finance_track_frontend/.env.development -----

```REACT_APP_BASE_URL=localhost:8000```

----- finance_track_frontend/.env.development -----

```REACT_APP_BASE_URL=localhost```

2. **Установка зависимостей (Для запуска без Docker)**:
    - Перейдите в каталог `finance_track_backend` и выполните команду `pip install -r requirements.txt` для установки необходимых зависимостей Python. Обратите внимание, что для работы приложения необходима база данных.
    - Перейдите в каталог `finance_track_frontend` и выполните команду `npm install` для установки необходимых зависимостей npm.

3. **Запуск проекта**:
    - Для разработки: Запустите ```docker-compose -f docker-compose-dev.yml up --build```.
    - Для продакшна: Запустите ```docker-compose -f docker-compose-prod.yml up --build```.

4. **Доступ к приложению**:
    - **Бэкенд для разработки**: http://localhost:8000/
    - **Фронтенд для разработки**: http://localhost:3000/
    - **Бэкенд для продакшна**: http://localhost/admin/ http://localhost/swagger/ 
    - **Фронтенд для продакшна**: http://localhost/

## Использованный фреймворк/шаблон
Фронтенд был разработан с использованием [argon-dashboard-react](https://github.com/creativetimofficial/argon-dashboard-react).


## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it according to the terms of the license.

## Авторы

Автор этого проекта - [0xN1ck](https://github.com/0xN1ck).
