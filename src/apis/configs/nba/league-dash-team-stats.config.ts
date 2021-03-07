import { INbaRequestConfig } from './interfaces';

export const leagueDashTeamStatsConfig: INbaRequestConfig = {
  url: 'https://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=<MEASURE_TYPE>&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=<PER_MODE>&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=<SEASON>&SeasonSegment=&SeasonType=<SEASON_TYPE>&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=',
  defaultParams: {
    'MeasureType': null,
    'PerMode': null,
    'PlusMinus': 'N',
    'PaceAdjust': 'N',
    'Rank': 'N',
    'LeagueID': '00',
    'Season': null,
    'SeasonType': null,
    'PORound': 0,
    'Outcome': null,
    'Location': null,
    'Month': 0,
    'SeasonSegment': null,
    'DateFrom': null,
    'DateTo': null,
    'OpponentTeamID': 0,
    'VsConference': null,
    'VsDivision': null,
    'TeamID': 0,
    'Conference': null,
    'Division': null,
    'GameSegment': null,
    'Period': 0,
    'ShotClockRange': null,
    'LastNGames': 0,
    'GameScope': null,
    'PlayerExperience': null,
    'PlayerPosition': null,
    'StarterBench': null
  },
  requiredUserParams: [
    'MeasureType',
    'PerMode',
    'Season',
    'SeasonType'
  ]
}
