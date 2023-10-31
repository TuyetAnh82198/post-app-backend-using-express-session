const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@users.nyp2s8t.mongodb.net/?retryWrites=true&w=majority`,
  databaseName: "post",
  collection: "sessions",
});

const isAuth = require("./middleware/isAuth.js");
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_APP,
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", users);
app.use("/posts", isAuth, posts);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@users.nyp2s8t.mongodb.net/post?retryWrites=true&w=majority`
  )
  .then((result) => {
    const io = require("./socket.js").init(
      app.listen(process.env.PORT || 5000)
    );
    io.on("connect", (socket) => {
      socket.on("disconnect", () => {});
    });
  })
  .catch((err) => console.log(err));
