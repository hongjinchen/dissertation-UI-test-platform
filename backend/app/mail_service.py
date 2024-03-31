from smtplib import SMTP_SSL
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.mime.base import MIMEBase
from email import encoders

host_server = 'smtp.qq.com'
sender_qq = '775363056@qq.com'
pwd = 'jytfijrqbwxnbege'


def send_email(email_address, email_content, attachments=[]):
    mail_title = 'Your Test Report'
    msg = MIMEMultipart()
    msg["Subject"] = Header(mail_title, 'utf-8')
    msg["From"] = sender_qq
    msg['To'] = email_address
    msg.attach(MIMEText(email_content, 'html', 'utf-8'))

    for file_path, file_name in attachments:
        with open(file_path, 'r', encoding='utf-8') as f:
            attachment_content = f.read()

        attachment = MIMEText(attachment_content, 'html', 'utf-8')
        attachment["Content-Disposition"] = f'attachment; filename="{file_name}"'
        msg.attach(attachment)

    smtp = SMTP_SSL(host_server)
    smtp.login(sender_qq, pwd)
    smtp.sendmail(sender_qq, [email_address], msg.as_string())
    smtp.quit()
    
    
    