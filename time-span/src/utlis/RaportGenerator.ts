import type { ITask } from "./TaskManager";

interface IRaportGenerator {
  fullList: () => string;
  shortList: () => string;
}

class RaportGenerator implements IRaportGenerator {
  constructor(
    protected taskLists: ITask[]
  ) {}

  fullList() {
    const raport = this.taskLists.map(t => {

    });

    return '';
  }

  // list
  shortList() {
    const raport = this.taskLists.map(t => t.name);

    return '';
  }
}
