export class MinerResponse {
  public nonce: string | undefined;

  public hash: string | undefined;

  public message: string | undefined;

  constructor(
    nonce: string | undefined,
    hash: string | undefined,
    message: string | undefined
  ) {
    this.nonce = nonce;
    this.hash = hash;
    this.message = message;
  }
}
