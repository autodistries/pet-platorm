Setu uip posgresql
- install package
- sudo -i -u postgres
- initdb --locale=C.UTF-8 --encoding=UTF8 -D '/var/lib/postgres/data'
- pg_ctl -D /var/lib/postgres/data -l logfile start
- createdb pet_accessories_db
- psql
- CREATE USER username WITH PASSWORD 'password';
- GRANT ALL PRIVILEGES ON DATABASE pet_accessories_db TO username;



idk how but we need to put the postgres (not implemneted yet)