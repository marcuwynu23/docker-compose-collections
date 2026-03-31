import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg["Subject"] = "Mailpit Test"
msg["From"] = "dev@example.local"
msg["To"] = "user@example.local"

msg.set_content(f"""
Hello from Mailpit.

This is a test email from Mailpit.
""")

with smtplib.SMTP("localhost", 1025) as s:
    s.send_message(msg)

print("sent mail")