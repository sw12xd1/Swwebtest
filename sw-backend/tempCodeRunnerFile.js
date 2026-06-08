app.get('/datas', (req, res) => {
    console.log(req.query)
    res.send('echo')
})
