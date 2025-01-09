import React from 'react'
import './base.less'
import * as styles from './index.module.css';
// import Editor from '@/components/edit'
import delPic from '@/assets/image/del@2x.png'
import {aaa} from '@/utils/test'
import '@/utils/loaderTest.abc'

aaa()
function App() {
  return <section>
    <h2>webpack5-react-ts</h2>
    <div className={styles.footer}>qwewq</div>
    <img src={delPic} alt="" />
    {/* <Editor/> */}
  </section>
}
export default App
