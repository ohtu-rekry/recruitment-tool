import React, { Component } from 'react'
import Frontpage from './frontpage/Frontpage'

import FrontPage from '../components/frontpage/FrontPage'

class App extends Component {
  render() {
    return (
      <div className='container'>
        <Frontpage />
      </div>
    )
  }
}

export default App