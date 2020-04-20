import { Carousel, Flex, Grid, SearchBar } from 'antd-mobile'
import { Route, Redirect } from 'react-router-dom'
import { getCity } from '../../utils/index'
import React from 'react'
import { API } from '../../utils/api'

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import './index.scss'

// import CityList from '../cityList/index'
const data1 = Array.from(new Array(4)).map(() => ({
  icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
}))
class Home extends React.Component {
  state = {
    data: ['1', '2', '3'],
    swipers: [],
    navItem: [
      {
        id: 1,
        img: Nav1,
        tex: '整租',
        path: '/home/list',
      },
      {
        id: 2,
        img: Nav2,
        tex: '合租',
        path: '/home/list',
      },
      {
        id: 3,
        img: Nav3,
        tex: '地图找房',
        path: '/map',
      },
      {
        id: 4,
        img: Nav4,
        tex: '去出租',
        path: '/rent',
      },
    ],
    isShowSwiper: false,
    groups: [], // 租房小组数据
    houseMsg: [],
    city: '上海',
  }
  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getHouseMsg()
    let res = await getCity()
    this.setState({
      city: res.label,
    })
  }
  // 获取轮播图数据方法
  async getSwipers() {
    const res = await API.get('/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body,
        isShowSwiper: true,
      }
    })
  }
  // 获取租房小组数据
  async getGroups() {
    const res = await API.get('/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0',
      },
    })
    this.setState({
      groups: res.data.body,
    })
  }
  // 获取房子信息
  async getHouseMsg() {
    const res = await API.get('/home/news', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0',
      },
    })
    this.setState({
      houseMsg: res.data.body,
    })
  }
  renderSwiper() {
    return this.state.swipers.map((val) => (
      <a
        key={val.id}
        href="http://www.alipay.com"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 212,
        }}
      >
        <img
          src={`http://localhost:8080${val.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }
  renderNavItem() {
    return this.state.navItem.map((item) => {
      return (
        <Flex.Item
          key={item.id}
          onClick={() => this.props.history.push(item.path)}
        >
          <img src={item.img} />
          <h2>{item.tex}</h2>
        </Flex.Item>
      )
    })
  }
  renderRentGroup() {
    return (
      <Grid
        className="rentGrid"
        data={this.state.groups}
        columnNum={2}
        hasLine={false}
        square={false}
        renderItem={(item) => (
          <Flex className="rentFlex">
            <div className="rentTop">
              <p className="title">{item.title}</p>
              <span className="info">{item.desc}</span>
            </div>

            <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
          </Flex>
        )}
      />
    )
  }
  renderHouseMsg() {
    return this.state.houseMsg.map((item, index) => {
      return (
        <div className="msgItem" key={item.title}>
          <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
          <Flex className="itemFlex" direction="column" justify="between">
            <h3>{item.title}</h3>
            <Flex className="info" justify="between">
              <span>{item.from}</span>
              <span>{item.date}</span>
            </Flex>
          </Flex>
        </div>
      )
    })
  }
  renderSearchBar() {
    return (
      <div className="search">
        <div
          className="location"
          onClick={() => this.props.history.push('/citylist')}
        >
          <span className="name">{this.state.city}</span>
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
      <div>
        <div className="swiper">
          {this.state.isShowSwiper ? (
            <Carousel autoplay={true} infinite autoplayInterval={1500}>
              {this.renderSwiper()}
            </Carousel>
          ) : (
            ''
          )}
          {this.renderSearchBar()}
          <i
            className="iconfont icon-map"
            onClick={() => this.props.history.push('/map')}
          />
        </div>

        <Flex className="nav">{this.renderNavItem()}</Flex>
        <div className="rentBox">
          <div className="navTitle">
            <h2>租房小组</h2>
            <a href="#">更多 </a>
          </div>
          {this.renderRentGroup()}
        </div>
        <div className="houseMsg">
          <h2>最新资讯</h2>
          {this.renderHouseMsg()}
        </div>
      </div>
    )
  }
}

export default Home
