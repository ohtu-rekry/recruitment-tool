import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as actions from '../actions/actions'
import * as selectors from '../selectors/selectors'
import jobApplicationApi from '../apis/jobApplicationApi'
import jobPostingApi from '../apis/jobPostingApi'

function* fetchJobPostings() {
  try {
    const recruiter = yield select(selectors.getUser)

    const response = yield call(jobPostingApi.get, { recruiter })

    if (response.status === 200) {
      yield put(actions.setJobPostings(response.data))
    }
  } catch (e) {
    console.log('Could not fetch job postings')
  }
}

function* getAllApplicants() {
  try {
    const recruiter = yield select(selectors.getUser)

    if (!recruiter) {
      return
    }

    const token = recruiter.token

    const response = yield call(jobApplicationApi.get, { token })

    let stages = []
    if (response.status === 200) {
      response.data.forEach(applicant => {
        stages = [
          ...stages,
          {
            id: applicant.PostingStage.id,
            jobPostingId: applicant.PostingStage.jobPostingId,
            orderNumber: applicant.PostingStage.orderNumber,
            stageName: applicant.PostingStage.stageName,
            applicants: [{
              id: applicant.id,
              postingStageId: applicant.postingStageId,
              applicantEmail: applicant.applicantEmail,
              applicantName: applicant.applicantName,
              applicationComments: applicant.applicationComments,
              createdAt: applicant.createdAt,
              jobPosting: applicant.PostingStage.JobPosting.title,
              attachments: applicant.attachments,
              jobPostingId: applicant.PostingStage.JobPosting.id
            }]
          }
        ]
      })
      /*
      Returns an array of unique stages.
      First checks final results array res for a Stage object with identical name.
      If there isn't one, it adds the stage to the final array. If there is,
      it finds that stage object and combines applicants from that and the stage with
      identical name.
      */
      const uniqueStages = stages.reduce((res, stg) => {
        let result = res.find(stage =>
          stage.stageName.toLowerCase().trim() === stg.stageName.toLowerCase().trim()
        )
        if (!result) return res.concat(stg)
        const index = res.findIndex(existingStage =>
          existingStage.stageName.toLowerCase().trim() === stg.stageName.toLowerCase().trim()
        )
        res[index].applicants = [...res[index].applicants, ...stg.applicants]
        return res
      }, [])

      /*
      Sorts unique stages based on their order number.
      Makes sure Accepted and Rejected stages are shown last.
      */
      const sortedUniqueStages = uniqueStages.map(stage => {
        const highestOrderNumber = uniqueStages.reduce((a, b) =>
          a.orderNumber > b.orderNumber ? a.orderNumber : b.orderNumber
        )

        if (stage.stageName === 'Rejected') {
          return { ...stage, orderNumber: highestOrderNumber + 2 }
        } else if (stage.stageName === 'Accepted') {
          return { ...stage, orderNumber: highestOrderNumber + 1 }
        }
        return stage
      })

      yield put(actions.updateStages(sortedUniqueStages))
    }

  } catch (e) {
    console.log(e)
  }
}

export const watchFetchJobPostings = takeLatest(actions.fetchJobPostings().type, fetchJobPostings)
export const watchGetAllApplicants = takeLatest(actions.getAllApplicants().type, getAllApplicants)
