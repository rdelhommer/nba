import { RequestWrapper } from '../../libs/request.lib';
import { INbaApiResponse } from './interfaces';
import { ITraditionalStats, mapRowSetToTraditionalStats } from './models/traditional.model';

const NUM_RETRIES = 5;
const REQUEST_DELAY_MS = 3000;

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

  private async sendRequestGetResponse(url, tryNumber?: number): Promise<INbaApiResponse> {
    return new Promise(async (resolve, reject) => {
      let responseData = null;
      let currentTry = 0;

      do {
        currentTry++;
        console.log('Send request: Try ' + (currentTry + 1));
        await this.wait(REQUEST_DELAY_MS);

        try {
          let response = await this.requestWrapper.sendRequest<INbaApiResponse>(
            url,
            {
              'Accept': 'application/json, text/plain, */*',
              'Accept-Encoding': 'gzip, deflate, sdch',
              'Accept-Language': 'en-US,en;q=0.8',
              'Connection': 'keep-alive',
              'DNT': 1,
              'Host': 'stats.nba.com',
              'Referer': 'http://stats.nba.com/scores/',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
              'x-nba-stats-origin': 'stats',
              'x-nba-stats-token': true
            },
            5000
          );

          if (response.resultSets[0].rowSet.length === 0) return null;
        
          return response;
        } catch (error) {
          // Log and Retry
          console.error(error);
        }
      } while(currentTry < NUM_RETRIES)
    });
  }

  async listTraditionalTeamStats(season: string, seasonType: SeasonType, perMode: PerMode): Promise<ITraditionalStats[]> {
    let baseUrl = 'https://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=<MEASURE_TYPE>&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=<PER_MODE>&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=<SEASON>&SeasonSegment=&SeasonType=<SEASON_TYPE>&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=';
    let url = baseUrl.replace('<SEASON>', season)
      .replace('<SEASON_TYPE>', seasonType)
      .replace('<PER_MODE>', perMode)
      .replace('<MEASURE_TYPE>', MeasureType.Base)

    let rawResponse = await this.sendRequestGetResponse(url);
    let resultSet = rawResponse.resultSets[0];
    return resultSet.rowSet.map(x => mapRowSetToTraditionalStats(x, resultSet.headers));
  }

  async listTraditionalPlayerStats() {
    // TODO: 
  }

  async getGameLogs() {
    // TODO: https://www.nba.com/stats/teams/boxscores-advanced/
  }
}
