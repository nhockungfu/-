var express = require('express'),
    session = require('express-session'),
    MySQLStore = require('express-mysql-session'),
    handlebars = require('express-handlebars'),
    handlebars_sections = require('express-handlebars-sections'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    wnumb = require('wnumb'),
    userController = require('./controllers/uController'),
    categoryController = require('./controllers/categoryController'),
    pageController = require('./controllers/pageController'),
    producesController = require('./controllers/producesController'),
    produceDetailController = require('./controllers/produceDetailController');
    producesController = require('./controllers/producesController'),
    layoutRoute = require('./controllers/_layoutRoute'),
    tController = require('./controllers/tuan');

var app = express();

app.use(morgan('dev'));

app.engine('hbs', handlebars({
    extname: 'hbs',
    defaultLayout: 'main2',
    layoutsDir: 'views/_layouts/',
    partialsDir: 'views/_partials/',
    helpers: {
        section: handlebars_sections(),
        number_format: function(n) {
            var nf = wnumb({
                thousand: ','
            });
            return nf.to(n);
        },
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
app.use(session({
    secret: 'Z7X7gXzoKBT8h18jwXBEP4T0kJ8=',
    resave: false,
    saveUninitialized: true,
    // store: new fileStore()
    store: new MySQLStore({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '1234',
        database: 'bid_management',
        createDatabaseTable: true,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    }),
}));
app.use(layoutRoute);
app.use('/produces', producesController);
app.use('/category', categoryController);
app.use('/user', userController);
app.use('/home', pageController);
app.use('/detail', produceDetailController);
app.use('/tuan', tController);

app.listen(3000,function () {
    console.log('server running...');
});