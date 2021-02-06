import psycopg2
from psycopg2.extras import RealDictCursor
import os


class TaskRepository:
    conn = None
    DATABASE_URL = os.environ['DATABASE_URL']
    # Attempt to connect to the database
    def connect(self):
        try:
            self.conn = psycopg2.connect(self.DATABASE_URL, sslmode='require')
            # self.conn = psycopg2.connect(
            #     host="localhost",
            #     database="tododb", #dfgm7t6b1o1cbf
            #     user="postgres", #zvifbjmfhsqbxm
            #     password="3f3qmkk7N)-POS") #ae36dac06743a98165c3d67e08a212b880165f2ae1fee10c0771cecddd36a893
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)

    # Executes a query and returns all results
    def query(self, query):
        try:
            cur = self.conn.cursor(cursor_factory=RealDictCursor)
            cur.execute(query)
            all_results = cur.fetchall()
            cur.close()
            return all_results
        except Exception as e:
            print(e)

    def inspect_all(self):
        return self.query(
            "SELECT COALESCE(to_char(taskdue, 'HH24:MI DD-MM-YYYY'), '') AS taskdue_str, taskname, taskdescription, taskcomplete, taskid FROM Tasks ORDER BY taskdue ASC;")

    def save_new(self, name, desc, due):
        insert_string = "INSERT INTO Tasks(taskname, taskdescription, taskdue, taskcomplete) VALUES (%s, %s, TIMESTAMP %s, false)"
        cur = self.conn.cursor()
        cur.execute(insert_string, (name, desc, due))
        self.conn.commit()

    def update_task(self, taskid, taskcomplete):
        cur = self.conn.cursor()
        cur.execute("UPDATE Tasks SET taskcomplete = %s WHERE taskid = %s", (taskcomplete, taskid))
        self.conn.commit()

    # Close DB connection
    def close(self):
        if self.conn is not None:
            self.conn.close()
