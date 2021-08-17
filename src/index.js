const express = require("express");
require("./db/mongoose");

const app = express();
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const port = process.env.PORT;

const multer = require('multer');
const upload = multer({
    dest: 'images'
})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
})

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

