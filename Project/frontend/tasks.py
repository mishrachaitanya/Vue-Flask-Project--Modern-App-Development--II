from workers import celery_app
from time import sleep
# import requests
from models import User,db,Blogs, Posts
from datetime import datetime, timedelta
from webhooks import *
from reports import *

@celery_app.task
def add(x,y):
    sleep(20)
    return x+y


@celery_app.task
def expire_token(username):
    if username:
        user=User.query.filter_by(username=username).first()
        sleep(30)
        user.token_valid="false"
        
        db.session.commit()
    else:
        return "Error"


# @celery_app.task
# def generate_csv():
#     return


from celery.schedules import crontab

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    ist_tz = 'Asia/Kolkata'
    # Calls test('hello') every 10 seconds.
    # sender.add_periodic_task(10.0, test.s('hello'), name='add every 10')
    # Calls test('world') every 30 seconds
    sender.add_periodic_task(
        crontab(hour=19, minute=12),
        send_reminder.s(),
    )


    sender.add_periodic_task(
        crontab(hour=7, minute=30, day_of_month=1),
        create_monthly_report_main.s(),
    )






