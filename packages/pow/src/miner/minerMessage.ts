import { MinerArgs } from "./minerArgs";

export enum MinerEvents {
  START
}

export class MinerMessage {
  public event: MinerEvents;

  public message: MinerArgs;

  constructor(event: MinerEvents, message: MinerArgs) {
    this.event = event;
    this.message = message;
  }
}
