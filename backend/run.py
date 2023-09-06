from app import app
from app import db
from werkzeug.serving import run_simple
import os

if __name__ == '__main__':
    with app.app_context():
        pass  # Add this if you don't have any code to run within the context, or you can remove the 'with' statement entirely if not needed
    #获取当前脚本的绝对路径
    current_path = os.path.dirname(os.path.abspath(__file__))
    cert_path = os.path.join(current_path, 'perksummit.club_bundle.crt')
    key_path = os.path.join(current_path, 'perksummit.club.key')
    
    run_simple('0.0.0.0', 5000, app, ssl_context=(cert_path, key_path))
    # app.run(host='0.0.0.0', port=5000,debug=True)
