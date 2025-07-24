const http = require("http");
const { Server } = require("socket.io");
var express=require("express");
var fileuploader=require("express-fileupload");
var path = require("path");
var mongooes = require("mongoose");
var cors = require("cors");
var dotenv = require('dotenv');



var app=express();




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




const { saveMessage } = require("./controllers/chatController");

app.use(express.urlencoded({extended:true}))
app.use(fileuploader());
app.use(cors());
dotenv.config();

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET","POST"],
    }
})

io.on("connection",(socket)=>{
    console.log("User Connected " + socket.id);

   
  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });


  socket.on("sendMessage", async (data) => {
    const { groupId, senderName, senderId, text } = data;
    if (!groupId || !text) return;

    
    await saveMessage(data);

    
    io.to(groupId).emit("newMessage", {
      groupId, senderName, senderId, text, timestamp: new Date()
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
  
})

server.listen(2027,function(){
    console.log("Server Started...");
})

var {url} = require("./config/config");
var urll = url;

mongooes.connect(urll).then(()=>{
    console.log("Connected");
}).catch((err)=>{
    console.log(err.message);
})

var createStudyPodRouter = require('./routers/createStudyPodRouter');
const UserRouter = require("./routers/UserRouter");
var PdfRouter = require("./routers/pdfRouter");
const ChatRouter = require("./routers/chatRouter");
var MarkdownRouter = require("./routers/MarkdownRouter");
var EventRouter = require('./routers/CalendarEventRouter');
app.use('/user', createStudyPodRouter);
app.use('/saveuser',UserRouter)
app.use('/pdf',PdfRouter);
app.use('/chat',ChatRouter);
app.use('/markdown',MarkdownRouter);
app.use('/event',EventRouter);

