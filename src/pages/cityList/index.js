import React from 'react'
import { NavBar, Toast } from 'antd-mobile'
import { List, AutoSizer } from 'react-virtualized'
import NavHeader from '../../component/NavHeader/index'
import axios from 'axios'
import './index.scss'

// 索引（A、B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50
// 有房源信息的城市的数组
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0, // 索引高亮
    }
    // 创建ref对象
    this.cityListComponent = React.createRef()
  }
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    let { cityList, cityIndex } = this.formatCityData(res.data.body)
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')
    let temp = localStorage.getItem('hkzf_city')
    cityList['#'] = [JSON.parse(temp)]
    cityIndex.unshift('#')
    this.setState({
      cityList,
      cityIndex,
    })
    // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
    // 注意：调用这个方法的时候，需要保证 List 组件中已经有数据了！如果 List 组件中的数据为空，就会导致调用方法报错！
    // 解决：只要保证这个方法是在 获取到数据之后 调用的即可。
    this.cityListComponent.current.measureAllRows()
  }
  formatCityIndex(letter) {
    switch (letter) {
      case '#':
        return '当前定位'
      case 'hot':
        return '热门城市'
      default:
        return letter.toUpperCase()
        break
    }
  }
  // 动态计算行高
  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    // console.log(cityList[cityIndex[index]].length)
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{this.formatCityIndex(letter)}</div>
        {cityList[letter].map((item, index) => {
          return (
            <div
              key={index}
              className="name"
              onClick={() => this.changeCity(item)}
            >
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }
  changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源信息', 1, null, false)
    }
  }
  formatCityData(list) {
    let cityList = {}
    let cityIndex = []
    list.forEach((item) => {
      let first = item.short.substr(0, 1)
      if (cityList[first]) {
        cityList[first].push(item)
      } else {
        cityList[first] = [item]
      }
    })
    cityIndex = Object.keys(cityList).sort()
    return {
      cityList,
      cityIndex,
    }
  }
  componentDidMount() {
    this.getCityList()
  }
  // 封装渲染右侧索引列表的方法
  renderCityIndex() {
    // 获取到 cityIndex，并遍历其，实现渲染
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => (
      <li
        className="cityIndexItem"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index)
        }}
      >
        <span className={activeIndex === index ? 'indexActive' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }
  // 滚动索引高亮
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      })
    }
  }
  render() {
    return (
      <div className="chooseCity">
        <NavHeader className="navbar">城市选择</NavHeader>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              width={width}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        <ul className="cityIndex">{this.renderCityIndex()}</ul>
      </div>
    )
  }
}

export default CityList
