import React from 'react'
import { SearchBar } from 'antd-mobile'
import './index.scss'
// import Filter from '../../component/Filter/index'
export default class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  renderSearchBar() {
    let { label } = JSON.parse(localStorage.getItem('hkzf_city'))
    return (
      <div className="search">
        <div
          className="location"
          onClick={() => this.props.history.push('/citylist')}
        >
          <span className="name">{label}</span>
          <i className="iconfont icon-arrow" />
        </div>
        <SearchBar
          placeholder="请输入小区或地址"
          onFocus={() => {
            this.props.history.push('/search')
          }}
        />
      </div>
    )
  }
  render() {
    return (
      <div className="list">
        <div className="tabBar">
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          {this.renderSearchBar()}
          <i
            className="iconfont icon-map"
            onClick={() => this.props.history.push('/map')}
          />
        </div>
      </div>
    )
  }
}
