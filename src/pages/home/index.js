import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import './index.css'

import Index from '../index/index'
import List from '../list/index'
import News from '../news/index'
import Profile from '../profile/index'
class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    selectedTab: this.props.location.pathname,
    tabbarItems: [
      {
        title: '首页',
        icon: 'icon-ind',
        path: '/home',
        id: 1,
      },
      {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/home/list',
        id: 2,
      },
      {
        title: '资讯',
        icon: 'icon-infom',
        path: '/home/news',
        id: 3,
      },
      {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile',
        id: 4,
      },
    ],
  }
  renderTabbarItem() {
    return this.state.tabbarItems.map((item) => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          })
          this.props.history.push(item.path)
        }}
        data-seed="logId"
      ></TabBar.Item>
    ))
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname != this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
  }
  render() {
    return (
      <div className="home">
        {/* tabbar组件 */}
        <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent={true}>
          {this.renderTabbarItem()}
        </TabBar>

        <Route path="/home" exact component={Index}></Route>
        <Route path="/home/list" component={List}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
      </div>
    )
  }
}

export default Home
