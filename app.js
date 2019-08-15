var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/rename',function(req,res) {

  const directoryPath = path.join(__dirname, 'pdf'); // loop files from folder
  const destinationPath = path.join(__dirname, 'tmp'); // destination

  let arr = [];
  let template = "";

  fs.readdir(directoryPath, function (err, files) {
      if (err) return console.log('Unable to scan directory: ' + err);

      files.forEach((file, index) => {

        const name = parseFloat( file.split('_')[4] );
        const fileName2 = String(name) + '.jpg'; // new file name

        const filePath = directoryPath + "/" + file;
        const filePath2 = destinationPath + "/" + fileName2;

        arr.push(fileName2);

        // rename & duplicate function =========================================
        fs.rename(filePath, filePath2, function (rename_err) {

          if (rename_err) throw rename_err;

          fs.stat(filePath2, function (err, stats) {
            if (rename_err) throw rename_err;
            // console.log('stats: ' + JSON.stringify(stats));
          });

        });
        // rename & duplicate function ends ====================================

      });

      for(let i=2; i<arr.length; i+=2) {
        const index1 = i;
        const index2 = i + 1;

        const format1 = String(index1).padStart(3, 0);
        const format2 = String(index2).padStart(3, 0);

        template += `
          <li class="d">
            <img src="pages/${index1}.jpg" width="76" height="100" class="page-${index1}">
            <img src="pages/${index2}.jpg" width="76" height="100" class="page-${index2}">
            <span>${index1}-${index2}</span>
          </li>
        `;
      }

      res.send(template);

  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
