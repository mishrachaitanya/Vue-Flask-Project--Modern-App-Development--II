from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

SMPTP_SERVER_HOST="localhost"
SMPTP_SERVER_PORT=1025
SENDER_ADDRESS="email@chait.com"
SENDER_PASSWORD=""

import os
from email.mime.application import MIMEApplication

def send_email_report(to_address,message,subject):
    msg=MIMEMultipart()
    msg["From"]=SENDER_ADDRESS
    msg["To"]=to_address
    msg["SUbject"]=subject
    msg.attach(MIMEText(message,"html"))

    s=smtplib.SMTP(host=SMPTP_SERVER_HOST, port=SMPTP_SERVER_PORT)
    s.login(SENDER_ADDRESS,SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()
    return True


def send_mail(report,data):
    users=[
        {"name":"Chait", "email":"cm@example.com"},
        {"name":"Chait2", "email":"cm2@example.com"}
    ]
    
    send_email_report(data[0]['username'] + "@gmail.com", subject="Monthly Report",
                           message=report)

def export_file_email():
    import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def email_export(to_address, message, subject, csv_file_path):
    msg = MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg["To"] = to_address
    msg["Subject"] = subject
    msg.attach(MIMEText(message, "html"))

    # Open the CSV file and read its contents
    with open(csv_file_path, "rb") as csv_file:
        csv_contents = csv_file.read()

    # Create a MIMEBase object with application/octet-stream as the content type
    csv_part = MIMEBase("application", "octet-stream")

    # Set the set_payload method of the MIMEBase object with the contents of the CSV file
    csv_part.set_payload(csv_contents)

    # Add headers to the MIMEBase object to specify the file name and encoding
    encoders.encode_base64(csv_part)
    csv_part.add_header("Content-Disposition", f"attachment; filename={csv_file_path}")
    
    # Attach the MIMEBase object to the email message using the attach method
    msg.attach(csv_part)

    s = smtplib.SMTP(host=SMPTP_SERVER_HOST, port=SMPTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()
    return True


