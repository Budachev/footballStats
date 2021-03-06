const axios = require('axios');
const express = require('express');
const config = require('./config.json');
const app = express();

const token = config.apiKey;
let competitionsData;

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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function errorHandler(err, res) {
  console.log(err)
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
