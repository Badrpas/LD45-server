const getTypeBySize = (size: number): string => {
  switch (size) {
    case 1:
      return 'Uint8';
    case 2:
      return 'Uint16';
    case 4:
      return 'Uint32';
    default:
      throw new Error('No suitable size type');
  }
};

type ViewSetMethodName = "setUint8" | "setUint16" | "setUint32";
type ViewGetMethodName = "getUint8" | "getUint16" | "getUint32";
type ViewMethodName = ViewGetMethodName | ViewSetMethodName;

const getMethodNames = (size: number): [ViewGetMethodName, ViewSetMethodName] => {
  const type = getTypeBySize(size);
  return [('get' + type) as ViewGetMethodName, ('set' + type) as ViewSetMethodName];
}

class DataContainer {
  needsUpdate: boolean = false;
  public data: Buffer = Buffer.from(new ArrayBuffer(4));
  public view: DataView = new DataView(this.data.buffer);
  private sizes: Array<number> = [2, 2];

  set (view: DataView) {
    let offset = 0;
    this.sizes.forEach(size => {
      const [get, set] = getMethodNames(size);
      const value = view[get](offset, true);
      this.view[set](offset, value, true);
      offset += size;
    });
  }

  static sized(size: number) {
    return class extends this {
      public data: Buffer = Buffer.from(new ArrayBuffer(size));
    };
  }
}

export class Position extends DataContainer {
  public x: number = 0;
  public y: number = 0;

  set (view: DataView) {
    this.x = view.getUint16(0, true);
    this.y = view.getUint16(2, true);
    this.needsUpdate = true;
  }
}

export class Action extends DataContainer.sized(5) {
  public size = 5;
}

export class Player {
  public position: Position = new Position;
  public action: Action = new Action;

  constructor () {
    console.log('action byte length', this.action.data.byteLength);
  }
}