import { INbaRequestConfig } from './interfaces';

export const teamGameLogsConfig: INbaRequestConfig = {
  url: 'http://stats.nba.com/stats/teamgamelogs',
  defaultParams: {
    'MeasureType':null,
    'PerMode':null,
    'LeagueID':'00',
    'Season':null,
    'SeasonType':null,
    'PORound':0,
    'TeamID':null,
    'PlayerID':null,
    'Outcome':null,
    'Location':null,
    'Month':0,
    'SeasonSegment':null,
    'DateFrom':null,
    'DateTo':null,
    'OppTeamID':0,
    'VsConference':null,
    'VsDivision':null,
    'GameSegment':null,
    'Period':0,
    'ShotClockRange':null,
    'LastNGames':0
  },
  requiredUserParams: [
    'GameID',
    'MeasureType',
    'PerMode',
    'Season',
    'SeasonType'
  ]
}