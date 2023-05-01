const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./Server/controllers/api/config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const helpers = require('./Server/controllers/utils/helpers');
const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const routes = require('./Server/controllers');
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
