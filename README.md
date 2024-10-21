# Set up two (split) terminals with environment setup (mac)
source env/bin/activate

# Set up two (split) terminals with environment setup (windows)
python -m venv venv #to set up env (if haven't done so)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
./env/Scripts/activate.ps1

# To run backend
cd (to) backend
pip install -r requirements.txt
python manage.py runserver

# To run frontend 
cd (to) frontends
npm install axios react-router-dom jwt-decode
npm install
npm run dev

# To run SQL queries
cd (to) backend
python manage.py dbshell

# To migrate changes after changing models
python manage.py makemigrations
python manage.py migrate

