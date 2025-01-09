import './public-path';
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

let instance = null;

function render() {
  instance = new Vue({
    render: (h) => h(App),
  }).$mount('#app');
}

render();

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue2] vue2 app bootstraped');
}
export async function mount(props) {
  console.log('[vue2] props from main framework mount', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance = null;
}
