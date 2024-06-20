import { createApp }  from 'vue'
import App from './App.vue'
import router from './routers/index'
import ELementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './index.css'
const app = createApp(App)


app.use(router)
app.use(ELementPlus)
app.mount('#app')
