from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.crud.candidate_ranking import get_ranked_candidates
from app.schemas.candidate_ranking import CandidateRankingResponse


router = APIRouter(
    prefix="/candidates",
    tags=["Candidate Ranking"]
)


@router.get(
    "/ranking",
    response_model=list[CandidateRankingResponse]
)
def rank_candidates(
    job_id: int,
    db: Session = Depends(get_db)
):
    return get_ranked_candidates(
        db=db,
        job_id=job_id
    )