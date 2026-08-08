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
    "Python", "Java", "C", "C++", "C#", "JavaScript", "TypeScript",
    "HTML", "CSS", "React", "Next.js", "Angular", "Vue",
    "Node.js", "Express", "FastAPI", "Flask", "Django",
    "SQL", "SQLAlchemy", "PostgreSQL", "MySQL", "MongoDB", "SQLite",
    "Git", "GitHub", "Docker", "Kubernetes",
    "AWS", "Azure", "GCP",
    "REST API", "GraphQL",
    "JWT", "OAuth",
    "Machine Learning", "Deep Learning",
    "Artificial Intelligence", "NLP",
    "TensorFlow", "PyTorch",
    "Scikit-learn", "Pandas", "NumPy",
    "OpenCV", "LangChain", "RAG",
    "LLM", "Ollama",
    "Redis", "Celery",
    "Linux", "Bash"
]


def extract_skills(text):
    found = []

    text = text.lower()

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text):
            found.append(skill)

    return sorted(list(set(found)))


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

def extract_job_skills(text: str):
    found = []

    text = text.lower()

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text):
            found.append(skill)

    return sorted(list(set(found)))
