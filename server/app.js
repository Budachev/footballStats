const axios       = require('axios');
const express     = require('express');
const config      = require('./config.json');
const app         = express();

const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const cors        = require('cors')

const jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User        = require('./models/user'); // get our mongoose model
const monk        = require('monk');
const token       = config.apiKey;

let competitionsData;

// mongoose.connect(config.database); 

app.set('secretKey', config.secretKey); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use morgan to log requests to the console
app.use(morgan('dev'));

const db = monk('localhost:27017/users');

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

let instance = axios.create({
  baseURL: 'https://api.football-data.org/v1/',
  //timeout: 1000,
  headers: {
    'X-Auth-Token': token
  }
});

let homeData = {
  data: null,
  date: new Date(),
}

function errorHandler(err, res) {
  let status = err.response ? err.response.status : 500;
  let error = err.response ? err.response.statusText : 'Something went wrong';

  res.status(status).send({
    error
  });
}

function getLastUrlId(url) {
  const splitted = url.split('/');
  return Number(splitted[splitted.length - 1]);
}

/* GET Userlist page. */
app.get('/users', function (req, res) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, app.get('secretKey'), (err, decoded) => {
        if (err) {
            res.status(400);
            res.send({ success: false, message: 'Failed to authenticate token.' });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            let db = req.db;
            let collection = db.get('usercollection');
            
            collection.find({},{},(e,docs) => {
                res.send(docs.filter(user => {
                  delete user.password;
                  return user;
                }));
            });
          }
        });
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
          success: false, 
          message: 'No token provided.'
      });    
    }    
});


/* POST to Add User Service */
app.post('/login', (req, res) => {
    // Set our internal DB variable
    let db        = req.db;

    // Get our form values. These rely on the "name" attributes
    let userName  = req.body.username;
    let userEmail = req.body.useremail;
    let password  = req.body.password;

    // Set our collection
    let collection = db.get('usercollection');

    collection.findOne( { username: userName },{},(err, user) => {
        if (err) throw err;
        if ( user.password === password ){
          let token = jwt.sign(user, app.get('secretKey'));
          user.token = token;
          res.json(user);
        } else {
          res.status(400);
          res.send("Invalid password or user name.");
        }
    });
});

/* POST to Add User Service */
app.post('/register', function(req, res) {
    // Set our internal DB variable
    let db         = req.db;

    // Get our form values. These rely on the "name" attributes
    let userName   = req.body.username;
    let userEmail  = req.body.useremail;
    let password   = req.body.password;
    // Set our collection
    let collection = db.get('usercollection');

    collection.findOne( { username: userName },{}, (err, user) => {
        if (err) throw err;

        if( user ){
          res.status(400);
          res.send(`User with name ${userName} already exists.`);
        } else {
          // Submit to the DB
          collection.insert({
              "username" : userName,
              "email" : userEmail,
              "password" : password,
          }, function (err, doc) {
              if (err) {
                  // If it failed, return error
                  res.send("There was a problem adding the information to the database.");
              }
              else {
                  // And forward to success page
                  let token = jwt.sign(doc, app.get('secretKey'));
                  doc.token = token;
                  res.json(doc);
              }
          });
        }
    });
});

app.get('/home', function (req, res) {
  let now = new Date();

  // We send this request not more than once every 5 minutes 
  if (now.getTime() - homeData.date.getTime() < 300000 && homeData.data) {
    homeData.date = now;
    console.log('cash');
    res.send(homeData.data);
  }

  instance.get('fixtures').then(response => {
      let competitions = [];

      response.data.fixtures = response.data.fixtures.map(match => {
        let links = match._links;

        links.homeTeam.id = getLastUrlId(links.homeTeam.href);
        links.awayTeam.id = getLastUrlId(links.awayTeam.href);
        links.competition.id = getLastUrlId(links.competition.href);
        links.self.id = getLastUrlId(links.self.href);

        if (!competitions.find(c => c === links.competition.id)) {
          if (links.competition.id != 432) {
            competitions.push(links.competition.id);
          }
        }

        return match;
      })

      let competitionsRequests = competitions.map(c => instance.get(`competitions/${c}/leagueTable`));

      if (competitionsData) {
        response.data.competitions = competitionsData;
        res.send(response.data);
      } else {
        axios.all(competitionsRequests)
          .then(axios.spread(function (...results) {
            response.data.competitions = results.map(r => {
              if (r.data._links) {
                r.data._links.competition.id = getLastUrlId(r.data._links.competition.href);
              }
              return r.data;
            });

            console.log('request');
            homeData.data = response.data;
            res.send(response.data);
          }))
      }
    })
    .catch((err) => {
      errorHandler(err, res);
    });
});

app.get('/fixtures/:id', function (req, res) {
  instance.get(`fixtures/${req.params.id}`).then(response => {
      response.data.fixture._links.competition.id = getLastUrlId(response.data.fixture._links.competition.href);
      response.data.fixture._links.awayTeam.id = getLastUrlId(response.data.fixture._links.awayTeam.href);
      response.data.fixture._links.homeTeam.id = getLastUrlId(response.data.fixture._links.homeTeam.href);
      res.send(response.data);
    })
    .catch((err) => {
      errorHandler(err, res);
    });
})

app.get('/competitions/:id/fixtures', function (req, res) {
  instance.get(`competitions/${req.params.id}/fixtures/`).then(response => {
      let fixtures = response.data.fixtures.map(game => {
        game._links.self = {
          id: getLastUrlId(game._links.self.href)
        }
        return game;
      })
      response.data.fixtures = fixtures;

      res.send(response.data);
    })
    .catch((err) => {
      errorHandler(err, res);
    });
})

let competitions;

app.get('/competitions', function (req, res) {
  if (competitions) {
    res.send(competitions);
  } else {
    instance.get('competitions/').then(response => {
      competitions = response.data;
      res.send(response.data);
    }).catch((err) => {
      errorHandler(err, res);
    });
  }
})

app.get('/competitions/:id/leagueTable/', function (req, res) {
  if (req.query.matchday) {
    instance.get(`competitions/${req.params.id}/leagueTable/?matchday=${req.query.matchday}`)
      .then(response => {
        let standing = response.data.standing.map(item => {
          item.id = getLastUrlId(item._links.team.href);
          return item;
        })
        response.data.standing = standing;
        res.send(response.data);
      })
  } else {
    let promise = new Promise((resolve, reject) => {
      axios.all([
          instance.get(`competitions/`),
          instance.get(`competitions/${req.params.id}/leagueTable`)
        ])
        .then(axios.spread(function (competitionsResponse, tableResponse) {
          let competitions = competitionsResponse.data;
          let competitionId = req.params.id;
          let data = tableResponse.data;

          let league = competitions.find((elem, i, arr) => {
            return elem.id == competitionId;
          });

          if (league) {
            data.numberOfMatchdays = league.numberOfMatchdays;
            data.id = league.id;
          }

          if (data.standing) {
            data.standing = data.standing.map(stand => {
              stand.id = getLastUrlId(stand._links.team.href);
              return stand;
            })
          }
          resolve(tableResponse.data);
        }))
        .catch((err) => {
          errorHandler(err, res);
        });
    });

    promise.then(result => {
      let url = `competitions/${result.id}/leagueTable/?matchday=${result.matchday - 1}`;

      instance.get(url)
        .then(response => {
          if (response.data.standing) {
            let prev = response.data.standing = response.data.standing.map(stand => {
              stand.id = getLastUrlId(stand._links.team.href);
              return stand;
            });

            prev.forEach(stand => {
              result.standing.forEach(s => {
                if (s.id === stand.id) {
                  s.prevPosition = stand.position;
                }
              })
            })
          }

          res.send(result)
        })
    }).catch(err => {
      console.log(err)
    });

  }
});


app.get('/teams/:id', function (req, res) {
  axios.all([
      instance.get(`teams/${req.params.id}`),
      instance.get(`teams/${req.params.id}/fixtures`)
    ])
    .then(axios.spread(function (teamResponse, fixturesResponse) {
      let fixtures = fixturesResponse.data.fixtures;
      teamResponse.data.games = fixtures.map(game => {
        game._links.self.id = getLastUrlId(game._links.self.href);
        return game;
      });
      teamResponse.data.teamId = req.params.id;
      res.send(teamResponse.data);
    }))
    .catch((err) => {
      errorHandler(err, res);
    });
});

app.get('/players/:id', function (req, res) {
  instance.get(`/teams/${req.params.id}/players`)
    .then(response => {
      res.send(response.data);
    })
    .catch((err) => {
      errorHandler(err, res);
    });
});

app.listen(3000, function () {
  console.log('express running at http://localhost:%d', 3000);
});
