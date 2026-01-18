export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerIntervalsResult {
  min: ProducerInterval[];
  max: ProducerInterval[];
}
