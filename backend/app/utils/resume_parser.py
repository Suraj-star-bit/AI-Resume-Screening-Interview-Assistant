import re

def extract_email(text: str):
    match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" , text )

    if match:
        return match.group()

    return None

def extract_phone(text: str):
    match = re.search(r"\+?\d[\d\s().-]{8,}\d" , text)

    if match:
        return match.group()

    return None

SKILLS = [
    "Python",
    "Java",
    "C++",
    "SQL",
    "PostgreSQL",
    "FastAPI",
    "Flask",
    "React",
    "Node.js",
    "Docker",
    "Git",
    "HTML",
    "CSS",
    "JavaScript",
    "NumPy",
    "Pandas",
    "Matplotlib",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn"
]


def extract_skills(text: str):
    found_skills = []

    text_lower = text.lower()
    for skill in SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)

        return found_skills


def extract_education(text: str):
    education_keywords = [
        "Bachelor",
        "Master",
        "B.Tech",
        "M.Tech",
        "B.E",
        "M.E",
        "Computer Science",
        "Engineering",
        "University",
        "College",
        "School",
        "Degree"
    ]

    found = []

    for keyword in education_keywords:
        if keyword.lower() in text.lower():
            found.append(keyword)

    return found


def extract_experience(text: str):
    experience_keywords = [
        "Experience",
        "Intern",
        "Internship",
        "Software Engineer",
        "Developer",
        "Research Assistant",
        "Project",
        "Worked",
        "Present",
        "Company"
    ]

    found = []

    text_lower = text.lower()

    for keyword in experience_keywords:
        if keyword.lower() in text_lower:
            found.append(keyword)

    return found