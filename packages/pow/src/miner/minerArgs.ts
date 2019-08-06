export class MinerArgs {
  public txBytes: string;

  public target: string;

  public offset: number;

  public step: number;

  constructor(txBytes: string, target: string, offset: number, step: number) {
    this.txBytes = txBytes;
    this.target = target;
    this.offset = offset;
    this.step = step;
  }
}
