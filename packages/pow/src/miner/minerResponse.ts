export class MinerResponse {
  public nonce: string | undefined;

  public txs: string | undefined;

  public message: string | undefined;

  constructor(
    nonce: string | undefined,
    txs: string | undefined,
    message: string | undefined
  ) {
    this.nonce = nonce;
    this.txs = txs;
    this.message = message;
  }
}
