

export class Player {
  public updated: boolean = false;

  public position: Buffer = Buffer.from(new ArrayBuffer(4));
  public positionView = new DataView(this.position.buffer, 0);

  public x: number = 0;
  public y: number = 0;

  setPosition (buf: Buffer) {
    const view = new DataView(buf.buffer, buf.byteOffset + 1);
    this.x = view.getUint16(0, true);
    this.y = view.getUint16(2, true);
    console.log(`set position to ${this.x} ${this.y}`);
    
    this.updated = true;
  }

}