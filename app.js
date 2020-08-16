const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();
const server = require('http').createServer(app);

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Allows images
app.use(express.static('../public/images'));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      autoRemove: 'interval'
    })
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/api', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// Static folder
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/login', express.static(path.join(__dirname, 'public')));
app.use('/home', express.static(path.join(__dirname, 'public')));
app.use('/tutorial', express.static(path.join(__dirname, 'public')));
app.use('/learn', express.static(path.join(__dirname, 'public')));
app.use('/volunteer', express.static(path.join(__dirname, 'public')));
app.use('/appointments', express.static(path.join(__dirname, 'public')));
app.use('/user', express.static(path.join(__dirname, 'public')));
app.use('/user/:id', express.static(path.join(__dirname, 'public')));
app.use('/chat/:id', express.static(path.join(__dirname, 'public')));

// Handle 404 - Keep this as a last route
app.set('view engine', 'ejs');
app.use(function (req, res, next) {
  res.render('Error404');
});

// Socket io config
const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
io.adapter(
  redisAdapter({
    host: process.env.REDIS_HOST_NAME,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_AUTH_PASS
  })
);

io.on('connection', (socket) => {
  socket.on('connectToRoom', (room, password) => {
    ChatRoom.findById(room, (err, chatRoom) => {
      if (!chatRoom || chatRoom.password !== password)
        socket.emit('accessDenied', 'Access Denied');
      else {
        socket.join(room);
      }
    });
  });

  socket.on('newMessageFromUser', (message) => {
    socket.to(message.chatRoom).broadcast.emit('newMessage', message);
    Message.create({
      chatRoom: message.chatRoom,
      message: message.message,
      sender: message.sender,
      type: message.type,
      createdAt: new Date(message.createdAt)
    });
  });
});

// Port
const PORT = process.env.PORT || 3001;

server.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
