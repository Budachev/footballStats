const axios = require('axios');
const express = require('express');

const app = express();

const token = '';

let competitions;

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
});

app.get('/fixtures/:id', function (req, res) {
    instance.get(`fixtures/${req.params.id}`).then(response => {
        res.send(response.data);
    })
});

app.get('/competitions/:id/fixtures', function (req, res) {
    instance.get(`competitions/${req.params.id}/fixtures/`).then(response => {
        res.send(response.data);
    })
});

app.get('/competitions', function (req, res) {
    instance.get('competitions/').then(response => {
        if (!competitions) {
            competitions = response.data;
        }
        res.send(response.data);
    })
});

app.get('/competitions/:id/leagueTable', function (req, res) {
    if (req.query.matchday) {
        instance.get(`competitions/${req.params.id}/leagueTable/?matchday=${req.query.matchday}`)
            .then(response => {
                res.send(response.data);
            })
    } else {
        instance.get(`competitions/${req.params.id}/leagueTable`)
            .then(response => {
                let id = req.params.id;
                let data = response.data;

                let league = competitions.find((elem, i, arr) => {
                    return elem.id == id;
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
                res.send(response.data);
            })
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
        .catch(err => {
            console.log(err)
        });
});

app.get('/players/:id', function (req, res) {
    instance.get(`/teams/${req.params.id}/players`)
        .then(response => {
            res.send(response.data);
        })
});

app.listen(3000, function () {
    console.log('express running at http://localhost:%d', 3000);
});


