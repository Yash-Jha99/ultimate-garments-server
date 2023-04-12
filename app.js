var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const userRouter = require("./routes/user")
const authRouter = require("./routes/auth")
const addressRouter = require("./routes/address")
const cartRouter = require("./routes/cart")
const imageRouter = require("./routes/image")
const productRouter = require("./routes/product")
const wishlistRouter = require("./routes/wishlist")
const adminRouter = require("./routes/admin");
const paymentRouter = require("./routes/payment")
const orderRouter = require("./routes/order")
const cors = require('cors')
const { admin, auth, access, user } = require('./middlewares/auth');
require("dotenv").config()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");

app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/img', imageRouter);
app.use(access)
app.use(user)
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);


app.use(auth)
app.use('/wishlist', wishlistRouter);
app.use('/address', addressRouter);
app.use('/cart', cartRouter);
app.use("/order", orderRouter)
app.use("/payment", paymentRouter)


app.use(admin)
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log("{ERROR}", err)
  // render the error page
  res.status(err.status || 500).send(err);
});

module.exports = app;
