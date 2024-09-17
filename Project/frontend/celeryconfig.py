from datetime import timedelta
from celery.schedules import crontab
broker_url="redis://localhost:6379/1"
result_backend="redis://localhost:6379/2"

# CELERYBEAT_SCHEDULE = {
#     'send-reminder-every-day': {
#         'task': 'tasks.send_reminder',
#         'schedule': crontab(hour=00, minute=20),
#         'args': (),
#         'kwargs': {},
#     },
#     'create-monthly-report-every-monday': {
#         'task': 'tasks.create_monthly_report',
#         'schedule': crontab(hour=7, minute=30, day_of_week=1),
#         'args': (),
#         'kwargs': {},
#     },
# }