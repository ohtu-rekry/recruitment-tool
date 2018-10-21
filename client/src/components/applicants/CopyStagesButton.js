import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'


const CopyStagesButton = () => {
  return (
    <div>
      <Link to='/jobposting/new' style={{ textDecoration: 'none' }}>
        <Button variant='outlined'>
          Copy Templates
        </Button>
      </Link>
    </div >
  )
}

export default CopyStagesButton
