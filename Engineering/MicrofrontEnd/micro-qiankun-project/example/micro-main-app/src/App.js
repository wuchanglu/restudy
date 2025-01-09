import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Menu } from 'antd'
import './App.css'
const menus = [
  {
    key: 'Home',
    title: '主页',
    path: '/',
    label: <Link to="/">主应用</Link>,
  },
  {
    key: 'app-vue1',
    route: '/app-vue1',
    title: 'vue微应用1',
    label: <Link to="/app-vue1">vue微应用1</Link>,
  },
  {
    key: 'app-vue2',
    route: '/app-vue2',
    title: 'vue微应用2',
    label: <Link to="/app-vue2">vue微应用2</Link>,
  },
]

function App() {
  let style = {
    width: '100vw',
    height: '100vh',
  }

  return (
    <Router>
      {/* <h1>主应用启动成功</h1> */}

      <div className="App">
        <Menu
          style={{
            width: 256,
          }}
          theme="dark"
          mode="inline"
          items={menus}
        ></Menu>
        <div id="micro-container" style={style}></div>
      </div>
    </Router>
  )
}

export default App
