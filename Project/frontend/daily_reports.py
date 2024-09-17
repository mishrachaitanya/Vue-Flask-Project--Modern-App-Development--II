from celery import shared_task
from datetime import datetime, timedelta
from reports import monthly_reports,daily_updates
import smtplib
from email.mime.text import MIMEText
from flask import render_template, render_template_string
from email.mime.text import MIMEText
from jinja2 import Template
import uuid
from fpdf import FPDF
import mail_hook

def format_report(template_file, data={}):
    with open(template_file) as file:
        template = Template(file.read())
        # print(data,"OKOKOKOK")
        return template.render(posts=data)

def create_pdf_report(data):
    message = format_report("C:\\Users\\Chaitanya\\Desktop\\Project2\\Project\\frontend\\reports.html", data=data)
    file_name = str(data[0]['username']) + ".pdf"
    print(file_name)
    mail_hook.main(message)
    # Create the PDF object
    pdf = FPDF()
    # Add a page
    pdf.add_page()
    # Set font and font size
    pdf.set_font("Arial", size=12)

    # Write the message to the PDF
    pdf.multi_cell(0, 10, message)
    # Save the PDF
    pdf.output(file_name)








@shared_task
def main(username):
    data = daily_updates(username)
    # print(data)
    # for blog in data:
    create_pdf_report(data)





