from smtplib import SMTP_SSL
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.mime.base import MIMEBase
from email import encoders
import json





def send_email(email_address, email_content, attachments=[]):
    # 环境变量读取
    config_file_path = 'app\config.json'

    with open(config_file_path, 'r') as config_file:
        config = json.load(config_file)
        host_server = config['email']['host_server']
        sender_qq = config['email']['sender_qq']
        pwd = config['email']['pwd']

        mail_title = 'Your Test Report'
        msg = MIMEMultipart()
        msg["Subject"] = Header(mail_title, 'utf-8')
        msg["From"] = sender_qq
        msg['To'] = email_address
        msg.attach(MIMEText(email_content, 'html', 'utf-8'))

        for file_path, file_name in attachments:
            with open(file_path, 'rb') as f:
                attachment = MIMEBase('application', 'octet-stream')
                attachment.set_payload(f.read())
                encoders.encode_base64(attachment)
                attachment.add_header('Content-Disposition', f'attachment; filename={file_name}')
                msg.attach(attachment)

        try:
            smtp = SMTP_SSL(host_server)
            smtp.login(sender_qq, pwd)
            smtp.sendmail(sender_qq, [email_address], msg.as_string())
            smtp.quit()
        except Exception as e:
            print(f"An error occurred: {e}")