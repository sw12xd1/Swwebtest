const express = require('express')
const cors = require('cors');
const app = express()
const PORT = 3000
const fs = require('fs')   
const path = require('path') 


app.use(cors());
app.use(express.json())

const apiPath = path.join(__dirname, 'api')
fs.readdirSync(apiPath).forEach(file => {
  if (file.endsWith('.js')) {
    const routeName = file.replace('.js', '') // 文件名就是路由名
    const route = require(path.join(apiPath, file))
    app.use(`/api/${routeName}`, route) // 自动挂载 /api/xxx
  }
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
