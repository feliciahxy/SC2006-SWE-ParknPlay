# Set up two (split) terminals with environment setup
source env/bin/activate

# To run backend
cd (to) backend
pip install -r requirements.txt
python manage.py runserver

# To run frontend 
cd (to) frontend
npm install axios react-router-dom jwt-decode
npm install
npm run dev

# To run SQL queries
cd (to) backend
python manage.py dbshell
