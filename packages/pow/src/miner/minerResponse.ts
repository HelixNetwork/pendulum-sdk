export class MinerResponse {
  public nonce: string | undefined;

  public txHex: string | undefined;

  public message: string | undefined;

  constructor(
    nonce: string | undefined,
    txHex: string | undefined,
    message: string | undefined
  ) {
    this.nonce = nonce;
    this.txHex = txHex;
    this.message = message;
  }
}
