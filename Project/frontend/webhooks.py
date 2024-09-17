from workers import celery_app 
from json import dumps
from httplib2 import Http
from models import Blogs
from models import User
from datetime import datetime,timedelta
@celery_app.task
def send_reminder():

    all_users=[]
    users=User.query.all()
    for i in users:
        all_users.append(i.username)

    last_24_hours = datetime.utcnow() - timedelta(hours=24)
    recent_blogs = Blogs.query.filter(Blogs.time < last_24_hours).all()
    print(recent_blogs)
    non_user=[]
    for i in recent_blogs:
        non_user.append(i.username)
    print(non_user)
    for i in non_user:        
        """Hangouts Chat incoming webhook quickstart."""
        url = 'https://chat.googleapis.com/v1/spaces/AAAAi3-qsKY/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=91WLUNybB-ANCKXpzwXgY3UESW8d8o_VjUSHYgjaEj4%3D'
        bot_message = {
            'text': f"Why you NO posting we WAITING+{i}"}
        message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
        http_obj = Http()
        response = http_obj.request(
            uri=url,
            method='POST',
            headers=message_headers,
            body=dumps(bot_message),
        )
        print(response)
    return "Reminder will be sent shortly"

import csv
import base64
import webhooks,mail_hook
@celery_app.task
def send_export_file(blogid,email):
    blog=Blogs.query.filter_by(blogid=blogid).first()
    title=blog.title
    caption=blog.caption
    image=blog.image
    username=blog.username
    headers = ["title", "caption", "image"]

# Create a list with the values for the CSV file
    values = [title, caption, image]
    # Open the CSV file for writing
    with open("blogpost.csv", "w", newline="") as csvfile:
        # Create a CSV writer object
        writer = csv.writer(csvfile)
        # Write the headers to the CSV file
        writer.writerow(headers)
        # Write the values to the CSV file
        writer.writerow(values)
    with open("C:/Users/Chaitanya/Desktop/Project2/blogpost.csv", "rb") as csvfile:
        csv_data = csvfile.read()
    csv_base64 = base64.b64encode(csv_data).decode("utf-8")
    mail_hook.email_export(email, "message", "Report", "C:/Users/Chaitanya/Desktop/Project2/blogpost.csv")




    # print("I AM HERERERRE")
    # url = 'https://chat.googleapis.com/v1/spaces/AAAAi3-qsKY/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=91WLUNybB-ANCKXpzwXgY3UESW8d8o_VjUSHYgjaEj4%3D'
    # bot_message = {
    #     'text': f"Your Report{username}",
    #     "attachments": [
    #         {
    #             "fileName": "blogpost.csv",
    #             "mimeType": "text/csv",
    #             "data": csv_base64
    #         }
    #     ]
    #     }
    # message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    # http_obj = Http()
    # response = http_obj.request(
    #     uri=url,
    #     method='POST',
    #     headers=message_headers,
    #     body=dumps(bot_message),
    # )
    # print(response)
