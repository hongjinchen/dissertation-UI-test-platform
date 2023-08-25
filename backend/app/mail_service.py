from smtplib import SMTP_SSL
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header

host_server = 'smtp.qq.com'
sender_qq = '775363056@qq.com'
pwd = 'jytfijrqbwxnbege'

def send_email(email_address, html_report_content):
    mail_title = 'Your Test Report'
    msg = MIMEMultipart()
    msg["Subject"] = Header(mail_title,'utf-8')
    msg["From"] = sender_qq
    msg['To'] = email_address
    msg.attach(MIMEText(html_report_content, 'html', 'utf-8'))

    # 使用SMTP服务发送邮件
    smtp = SMTP_SSL(host_server)
    smtp.login(sender_qq, pwd)
    smtp.sendmail(sender_qq, [email_address], msg.as_string())
    smtp.quit()
