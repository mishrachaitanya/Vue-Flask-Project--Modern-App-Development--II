from models import *
from datetime import datetime, timedelta
from workers import celery_app
# from webhooks import main,create_pdf_report
import uuid
from fpdf import FPDF
import mail_hook
import pdfkit
from models import User, Blogs
from jinja2 import Template
from mail_hook import send_mail
#Monthly Task-REPORT
@celery_app.task
def create_monthly_report_main():
    Users=User.query.all()
    for i in Users:
        data = monthly_reports(i.username)
        if len(data)>0:
            # print(data,"DATAAAA")
            create_pdf_report(data)

def format_report(template_file, data={}):
    with open(template_file) as file:
        template = Template(file.read())
        # print(data,"OKOKOKOK")
        return template.render(posts=data)
    


import docraptor
def create_pdf_report(data):
    doc_api = docraptor.DocApi()
    # this key works in test mode!
    file_name = str(data[0]['username']) + ".pdf"
    doc_api.api_client.configuration.username = 'YOUR_API_KEY_HERE'
    message = format_report("C:\\Users\\Chaitanya\\Desktop\\Project2\\Project\\frontend\\reports.html", data=data)
    # print(message)
    # print(data,'jfashnfjkasbhfjksabfkjsafjksngkm')
    send_mail(message,data)
    try:
        response = doc_api.create_doc({
            'test': True,  # test documents are free but watermarked
            'document_type': 'pdf',
            'document_content': message,

        })

        # create_doc() returns a binary string
        with open(file_name, 'w+b') as f:
            binary_formatted_response = bytearray(response)
            f.write(binary_formatted_response)
            f.close()
        print('Successfully created docraptor-hello.pdf!')

    except docraptor.rest.ApiException as error:
        print(error.status)
        print(error.reason)
        print(error.body)


import base64
def monthly_reports(username):
    today = datetime.utcnow()
    last_30_days = today - timedelta(days=30)

    posts = db.session.query(Blogs).filter(Blogs.time >= last_30_days, Blogs.time <= today).all()
    result=[]
    
    for i in posts:
        if i.username==username:
            encoded_string=''
            
            with open(f"C:/Users/Chaitanya/Desktop/Project2/Project/frontend/static/uploads/{i.image}", "rb") as image_file:                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            obj={}
            obj['title']=i.title
            obj['caption']=i.caption
            obj['image']=encoded_string
            obj['username']=i.username
            result.append(obj)
    
    return (result)
################################################





def daily_updates(username):
    blogs=Blogs.query.filter_by(username=username).all()
    lists=[]
    list_of_blogs=[]
    url='''https://chat.googleapis.com/v1/spaces/AAAAi3-qsKY/messages?
    key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=91WLUNybB-ANCKXpzwXgY3UESW8d8
    o_VjUSHYgjaEj4%3D'''
    for i in blogs:
        posts=Posts.query.filter_by(post_id=blogs.blogid).all()
        for j in posts:
            obj={
                "blogid":j.post_id,
                "comment":j.comment,
            }
            lists.append(obj)
        list_of_blogs.append(lists)
    
    return list_of_blogs
        
   
