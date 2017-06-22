var express = require('express'),
    handlebars = require('express-handlebars'),
    handlebars_sections = require('express-handlebars-sections'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    wnumb = require('wnumb'),
    userController = require('./controllers/uController'),
    categoryController = require('./controllers/categoryController'),
    pageController = require('./controllers/pageController'),
    producesController = require('./controllers/producesController');

var app = express();

app.use(morgan('dev'));

app.engine('hbs', handlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/_layouts/',
    partialsDir: 'views/_partials/',
    helpers: {
        section: handlebars_sections(),
        number_format: function (n) {
            var nf = wnumb({
                thousand: ','
            });
            return nf.to(n);
        }
    }
}));
app.set('view engine', 'hbs');

app.use(express.static(
    path.resolve(__dirname, 'public')
));
app.use(express.static(
    path.resolve(__dirname, 'data')
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/produces', producesController);
app.use('/category', categoryController);
app.use('/user', userController);
app.use('/home', pageController);

app.listen(3000,function () {
    console.log('server running...');
});