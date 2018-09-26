const jobPostings = [
  {
    'id': 1,
    'title': 'Front-end developer',
    'createdBy': 'Emblica Man',
    'Content': 'Apply here!'
  }
]

const getAll = () => {
  return Promise.resolve(jobPostings)
}

export default { getAll, jobPostings }