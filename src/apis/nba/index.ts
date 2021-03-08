import { RequestWrapper } from '../../libs/request.lib';
import { INbaApiResponse } from './interfaces';
import { IPlayerBoxScoreTraditionalStats, IPlayerTraditionalStats, ITeamTraditionalStats, mapRowSetToPlayerBoxScoreTraditionalStats, mapRowSetToPlayerTraditionalStats, mapRowSetToTeamTraditionalStats } from './models/traditional.model';

const NUM_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export enum SeasonType {
  RegularSeason = 'Regular Season',
  Playoffs = 'Playoffs'
}

export enum PerMode {
  PerGame = 'PerGame',
  Totals = 'Totals'
}

export enum MeasureType {
  Base = 'Base',
  Advanced = 'Advanced',
  Misc = 'Misc',
  Scoring = 'Scoring',
  Usage = 'Usage',
  Opponent = 'Opponent',
  Defense = 'Defense'
}

export class NbaApi {
  constructor(
    private requestWrapper: RequestWrapper,
  ) { }

  private async wait(timeToWaitMs:number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), timeToWaitMs);
    });
  }

  private async sendRequestGetResponse(url: string): Promise<INbaApiResponse> {
    return new Promise(async (resolve, reject) => {
      let currentTry = 0;
      let cachedError;

      do {
        currentTry++;

        try {
          let response = await this.requestWrapper.sendRequest<INbaApiResponse>(
            url,
            {
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.5',
              'x-nba-stats-origin': 'stats',
              'x-nba-stats-token': 'true',
              'Connection': 'keep-alive',
              'Host': 'stats.nba.com',
              'Referer': 'https://www.nba.com/stats/',
              'Origin': 'https://www.nba.com',
            },
            10000
          );

          if (response.resultSets[0].rowSet.length === 0) return resolve(null);
        
          return resolve(response);
        } catch (error) {
          // Log and Retry
          console.error(error);
          await this.wait(RETRY_DELAY_MS);
        }
      } while(currentTry < NUM_RETRIES)

      reject(cachedError);
    });
  }

  async listTraditionalTeamStats(season: string, seasonType: SeasonType, perMode: PerMode): Promise<ITeamTraditionalStats[]> {
    let url = `https://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=${MeasureType.Base}&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=${perMode}&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=${seasonType}&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=`;

    let rawResponse = await this.sendRequestGetResponse(url);
    let resultSet = rawResponse.resultSets[0];

    return resultSet.rowSet.map(x => mapRowSetToTeamTraditionalStats(x, resultSet.headers));
  }

  async listTraditionalPlayerStats(season: string, seasonType: SeasonType, perMode: PerMode): Promise<IPlayerTraditionalStats[]> {
    let url = `https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=${MeasureType.Base}&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=${perMode}&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=${seasonType}&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight=`;

    let rawResponse = await this.sendRequestGetResponse(url);
    let resultSet = rawResponse.resultSets[0];

    return resultSet.rowSet.map(x => mapRowSetToPlayerTraditionalStats(x, resultSet.headers));
  }

  async getPlayerGameLogs(playerId: number, season: string, seasonType: SeasonType, perMode: PerMode): Promise<IPlayerBoxScoreTraditionalStats[]> {
    let url = `https://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=${MeasureType.Base}&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=${perMode}&Period=0&PlayerID=${playerId}&PlusMinus=N&Rank=N&Season=${season}&SeasonSegment=&SeasonType=${seasonType}&ShotClockRange=&VsConference=&VsDivision=`;

    let rawResponse = await this.sendRequestGetResponse(url);
    let resultSet = rawResponse.resultSets[0];

    return resultSet.rowSet.map(x => mapRowSetToPlayerBoxScoreTraditionalStats(x, resultSet.headers));
  }
}
