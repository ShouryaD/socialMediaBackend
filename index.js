const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors')
const dbConfig = require("./dbConfig");
dbConfig();
const port = process.env.port || 3000;


//all routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require('./routes/postRoutes')
const messageRoutes = require('./routes/messageRoutes')

//while using template engine we use app.set
app.set('view engine', 'ejs')

//middleware
const corsOptions = {
  origin: 'https://social-media-frontend-theta-five.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json({ limit: "50mb" }));
app.use("/users", userRoutes);
app.use('/posts', postRoutes)
app.use('/message', messageRoutes)


let users = new Map()
let addUser = (userId, socketId) => {
  users.set(userId, socketId)
  console.log(users)
}

io.on('connection', (socket) => {
  console.log('User Connected!', socket.id)

  socket.on('addUser', (userId) => {
    console.log("useriD:", userId, socket.id)
    addUser(userId, socket.id)
  })
  
  socket.on('sendMessage', ({ recieverId, userId, message }) => {
    console.log({ recieverId, userId, message }, "message")
    let friend = users.has(recieverId)
    console.log(friend)
    let friendSocketId = users.get(recieverId)
    console.log(friendSocketId)
    io.to(friendSocketId).emit("getMessage",{ recieverId, userId, message })
  })

})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});