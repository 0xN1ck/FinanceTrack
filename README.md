<p align="center">
  <img src="finance_track_frontend/src/assets/img/brand/finance-track.png" alt="FinanceTrack Logo">
</p>

FinanceTrack is a project for managing employee data for administrators and for users to view their work.

## Project Structure

### Backend

- **Dockerfile-dev**: Dockerfile for backend development.
- **Dockerfile-prod**: Dockerfile for backend production.
- **FinanceTrack/**: Directory with main Django application files.
- **entrypoint-dev.sh**: Entry script for development.
- **entrypoint-prod.sh**: Entry script for production.
- **manage.py**: Main Django management script.
- **record/**: Django application for records.
- **requirements.txt**: Python dependency file.

### Frontend

- **.npmrc**: npm settings file.
- **Dockerfile-dev**: Dockerfile for frontend development.
- **Dockerfile-prod**: Dockerfile for frontend production.
- **jsconfig.json**: JavaScript settings file.
- **nginx/**: Directory with Nginx configuration.
- **package-lock.json**: npm dependency file.
- **package.json**: npm settings file.
- **public/**: Directory with public frontend files.
- **src/**: Directory with frontend source code.

## Installation and Usage

1. **Create .env Files**

- `./finance_track_backend/.env.dev`
- `./finance_track_frontend/.env.development`
- `./finance_track_backend/.env.prod`
- `./finance_track_frontend/.env.production`
- `.env.dev.db`
- `.env.prod.db`

#### Example .env Structure

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

----- finance_track_frontend/.env.production -----

```REACT_APP_BASE_URL=localhost```

2. **Install Dependencies (For Non-Docker Setup)**:
    - Navigate to the `finance_track_backend` directory and run `pip install -r requirements.txt` to install necessary Python dependencies. Note that a database is required for the application to function.
    - Navigate to the `finance_track_frontend` directory and run `npm install` to install necessary npm dependencies.

3. **Run the Project**:
    - For development: Run ```docker-compose -f docker-compose-dev.yml up --build```.
    - For production: Run ```docker-compose -f docker-compose-prod.yml up --build```.

4. **Accessing the Application**:
    - **Development Backend**: http://localhost:8000/
    - **Development Frontend**: http://localhost:3000/
    - **Production Backend**: http://localhost/admin/ http://localhost/swagger/ 
    - **Production Frontend**: http://localhost/

## Framework/Template Used
The frontend was developed using [argon-dashboard-react](https://github.com/creativetimofficial/argon-dashboard-react).

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it according to the terms of the license.

## Authors

The author of this project is [0xN1ck](https://github.com/0xN1ck).
