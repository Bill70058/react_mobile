import React from 'react'
import { Button } from 'antd-mobile'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom'

import Home from './pages/home/index'
import CityList from './pages/cityList/index'
import Search from './pages/search/index'
import Rent from './pages/rent/index'
import Map from './pages/map/index'

function App() {
  return (
    <div id="App">
      <Router>
        {/* 重定向，将路径 / 重定向为路径 /home */}
        <Route path="/" render={() => <Redirect to="/home" />}></Route>
        <Route path="/home" component={Home} />
        <Route path="/search" component={Search}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/citylist" component={CityList} />
        <Route path="/rent" component={Rent} />
      </Router>
    </div>
  )
}

export default App
