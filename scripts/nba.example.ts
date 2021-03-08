
import { NbaApi, PerMode, SeasonType } from '../src/apis/nba';
import { RequestWrapper } from '../src/libs/request.lib';

var api = new NbaApi(new RequestWrapper());

async function gogo() {
  let teamStats = await api.listTraditionalTeamStats('2020-21', SeasonType.RegularSeason, PerMode.Totals);
  console.log(`${teamStats[0].teamName} Traditional Stats`);
  console.log(teamStats[0]);

  let playerStats = await api.listTraditionalPlayerStats('2020-21', SeasonType.RegularSeason, PerMode.Totals);
  console.log(`${playerStats[0].playerName} Traditional Stats`);
  console.log(playerStats[0]);

  let singlePlayerBoxes = await api.getPlayerGameLogs(playerStats[0].playerId, '2020-21', SeasonType.RegularSeason, PerMode.Totals);
  console.log(`${singlePlayerBoxes[0].playerName} Traditional Box Score`);
  console.log(singlePlayerBoxes[0]);
}

gogo();
