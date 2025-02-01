class Action {
  private doValue;
  private do: () => any;
  private undo: (doValue: any) => boolean|Promise<boolean>;

  constructor(doFn: () => any, undoFn: (doValue: any) => boolean|Promise<boolean>) {

    this.do = doFn;
    this.undo = undoFn;
    this.doValue = this.do();
  }

  async Undo() {
    await this.undo(this.doValue);
  }

  Do() {
    this.doValue = this.do();
  }
}

export default class ActionsService {
  private actions: Action[] = [];
  private undoActions: Action[] = [];

  constructor() {}

  RegisterAction(doFn: () => void, undoFn: (doValue: any) => (boolean|Promise<boolean>)) {
    this.actions.push(new Action(doFn, undoFn));
  }

  async Undo() {
    const a = this.actions.pop();
    console.log("undo got", a);
    if (a) {
      await a.Undo();
      this.undoActions.push(a);
    }
  }

  Redo() {
    const a = this.undoActions.pop();
    if (a) {
      a.Do();
      this.actions.push(a);
    }
  }
}