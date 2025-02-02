export type ActionStatus = {
  saveAction: boolean,
  returnVal?: any
}

type ActionDoFn = (redoVal?: any) => (ActionStatus|Promise<ActionStatus>);
type ActionUndoFn = (doReturnVal: any) => (boolean|Promise<boolean>)

class Action {
  private doValue: any;
  private do: ActionDoFn;
  private undo: ActionUndoFn;

  constructor(doFn: ActionDoFn, undoFn: ActionUndoFn) {
    this.do = doFn;
    this.undo = undoFn;
  }

  async Undo() {
    await this.undo(this.doValue);
  }

  async Do(): Promise<boolean> {
    const status = await this.do(this.doValue);
    this.doValue = status.returnVal;
    return status.saveAction;
  }
}

export default class ActionsService {
  private actions: Action[] = [];
  private undoActions: Action[] = [];

  constructor() {}

  async RegisterAction(doFn: ActionDoFn, undoFn: ActionUndoFn) {
    const a = new Action(doFn, undoFn);
    const shouldSave = await a.Do();
    if (shouldSave) {
      this.actions.push(a);
    }
  }

  async Undo() {
    const a = this.actions.pop();
    if (a) {
      await a.Undo();
      this.undoActions.push(a);
    }
  }

  async Redo() {
    const a = this.undoActions.pop();
    if (a) {
      const shouldSave = await a.Do();
      if (shouldSave) {
        this.actions.push(a);
      }
    }
  }
}