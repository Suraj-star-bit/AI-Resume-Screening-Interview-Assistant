def calculate_skill_match(resume_skills, job_skills):
    resume_set = {skill.lower() for skill in resume_skills}
    job_set = {skill.lower() for skill in job_skills}

    matched_skills = resume_set.intersection(job_set)
    missing_skills = job_set - resume_set

    if not job_set:
        score = 0
    else:
        score = (len(matched_skills) / len(job_set)) * 100

    return {
        "score": round(score, 2),
        "matched_skills": sorted(matched_skills),
        "missing_skills": sorted(missing_skills)
    }