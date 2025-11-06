import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// PrimeVue 配置
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Textarea from 'primevue/textarea'
import MultiSelect from 'primevue/multiselect'
import Paginator from 'primevue/paginator'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'

// PrimeVue 样式
import 'primeicons/primeicons.css'

const app = createApp(App)

// 使用 PrimeVue (无样式模式)
app.use(PrimeVue, { unstyled: true })
app.use(ToastService)
app.use(ConfirmationService)

// 注册全局组件
app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Select', Select)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Tag', Tag)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Card', Card)
app.component('Checkbox', Checkbox)
app.component('RadioButton', RadioButton)
app.component('Textarea', Textarea)
app.component('MultiSelect', MultiSelect)
app.component('Paginator', Paginator)
app.component('ConfirmDialog', ConfirmDialog)

app.use(router)
app.mount('#app')