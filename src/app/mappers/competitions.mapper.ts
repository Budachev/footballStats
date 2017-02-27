export default {
    standingsMapper(standings, fixtures) {

    return standings.map(stand => {
      let temp = [];

      fixtures.forEach(fixture => {
        if ( fixture.status === 'FINISHED'
          && (fixture.awayTeamName === stand.teamName || fixture.homeTeamName === stand.teamName)
          ) {
          temp.push(fixture);
        }
      });

      let lastGames = temp.length > 5 ? temp.splice(-5) : temp;

      lastGames = lastGames.map(s => {
        let winner;

        if (s.result.goalsHomeTeam === s.result.goalsAwayTeam) {
          winner = 'draw';
        } else {
          let winnerName = s.result.goalsHomeTeam < s.result.goalsAwayTeam ? 'homeTeamName' : 'awayTeamName';
          // TODO somesing wrong with calculation of winner
          if (stand.teamName === s[winnerName]) {
            winner = true;
          } else {
            winner = false;
          }
        }

        s.result.winner = winner;

        return s;
      });

      stand.lastGames = lastGames;
      return stand;
    });
  }
};
