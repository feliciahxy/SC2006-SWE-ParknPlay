# to run frontend
```
cd frontend
```
```
npm run dev
````

# to run backend
```
cd backend/mysite/
```
```
python manage.py runserver
```

# how to connect to postgresql database
1. download postgresql from https://www.postgresql.org/download/
   - download pgadmin 4 too (database gui) 
2. go to pgadmin 4 -> create database -> name it "parknplaydb"
3. place .env file under backend/mysite/mysite/
4. pip install django-environ
5. pip install psycopg2-binary 
6. python manage.py makemigrations
7. python manage.py migrate
8. go back to pgadmin 4 -> schemas -> public -> tables -> parknplay_user -> right click on view/edit data -> all rows -> can manually add/delete rows there 
