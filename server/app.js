const axios = require('axios');
const express = require('express');
const config = require('./config.json');
const app = express();

const token = config.apiKey;

let instance = axios.create({
    baseURL: 'https://api.football-data.org/v1/',
    //timeout: 1000,
    headers: { 'X-Auth-Token': token }
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function errorHandler(err, res) {
    console.log(err)
    let status = err.response ? err.response.status : 500;
    let error = err.response ? err.response.statusText : 'Something went wrong';

    res.status(status).send({ error });
}

function getLastUrlId(url) {
    const splitted = url.split('/');
    return Number(splitted[splitted.length - 1]);
}

app.get('/home', function (req, res) {
    instance.get('fixtures').then(response => {
        response.data.fixtures = response.data.fixtures.map(match => {
            match._links.homeTeam.id = getLastUrlId(match._links.homeTeam.href);
            match._links.awayTeam.id = getLastUrlId(match._links.awayTeam.href);

            match._links.competition.id = getLastUrlId(match._links.competition.href);

            match._links.self.id = getLastUrlId(match._links.self.href);
            return match;
        })

        res.send(response.data);
    })
        .catch((err) => {
            errorHandler(err, res);
        });
});

app.get('/fixtures/:id', function (req, res) {
    instance.get(`fixtures/${req.params.id}`).then(response => {
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


app.get('/competitions', function (req, res) {
    instance.get('competitions/').then(response => {
        res.send(response.data);
    }).catch((err) => {
        errorHandler(err, res);
    });
})


app.get('/competitions/:id/leagueTable/', function (req, res) {
    if (req.query.matchday) {
        instance.get(`competitions/${req.params.id}/leagueTable/?matchday=${req.query.matchday}`)
            .then(response => {
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

app.listen(3001, function () {
    console.log('express running at http://localhost:%d', 3001);
});


