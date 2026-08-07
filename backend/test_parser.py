from app.services.resume_parser import extract_text_from_pdf

file_path = "uploads/Resume.pdf"

text = extract_text_from_pdf(file_path)

print(text)