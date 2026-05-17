import Service from '@ember/service';

export default class AnalysisScrollService extends Service {
  scrollElement = null;
  restoreScroll = false;
  scrollHeight = null;
}
