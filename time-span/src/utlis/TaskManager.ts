import { time } from "../stores/stores";
import { get, writable, readonly } from "svelte/store";
import type { Writable, Updater, Readable } from "svelte/store";

interface Session {
  taskList: Task[];
  date: string;
  state: "active" | "finished";
}

export interface ITask {
  name: string;
  state: TaskState;
  subTasks: ISubtask[];
  timeManager: TimeManager;
}

export interface ISubtask {
  name: string;
  state: TaskState;
}

export interface TimeSpan {
  started: string;
  finished: null | string;
}

export enum TaskState {
  Active = "active",
  Paused = "paused",
  Finished = "finished",
}

export type TaskType = ITask|ISubtask;


class TimeManager {
  constructor(public timeSpans: Writable<TimeSpan[]>) {
    this.start();
  }

  #activeSpan: TimeSpan|null = null;

  get _timeSpans() {
    return readonly(this.timeSpans);
  }

  start() {
    const newTimespan: TimeSpan = {
      started: get(time).format("HH:mm:ss"),
      finished: null,
    };

    this.#activeSpan = newTimespan;
    this.timeSpans.update(t => [ ...t, newTimespan ]);
  }

  stop() {
    if (!this.#activeSpan) return;

    this.#activeSpan.finished = get(time).format("HH:mm:ss");
  }
}

class TaskController {
  #taskCollection: Writable<TaskType[]>;

  get #_taskCollection() {
    return get(this.#taskCollection);
  }
  get taskCollection() {
    return readonly(this.#taskCollection);
  }

  constructor(
    collection: TaskType[],
  ) {
    this.#taskCollection = writable(collection);
  }

  add(task: TaskType) {
    const duplicate = this.#_taskCollection
      .find((s) => s.name === task.name);

    if(duplicate) throw new Error("There's a task with the same name");

    this.#taskCollection.update(c => [ ...c, task ]);
  }

  delete(task: TaskType) {
    this.#taskCollection.update(c => c
      .filter(t => t.name !== task.name)
    );
  }

  rename() {}

  toggleState() {}
}

class SubtaskManager {
  #subtasks = writable<Subtask[]>([]);

  get #_subtasks() {
    return get(this.#subtasks);
  }
  get subtasks() {
    return readonly(this.#subtasks);
  }

  addSubtask(name: string) {
    const duplicate = this.#_subtasks.find((s) => s.name === name);
    if(duplicate) return;

    const newSubtask = { name: name, state: TaskState.Active };
    this.#subtasks.update(s => [ ...s, newSubtask ]);

    console.log(this.#_subtasks);
  }

  deleteSubtask(name: string) {
    const taskIndex = this.#_subtasks.findIndex(s => s.name === name);
    if(!taskIndex) return;

    this.#subtasks.update(s => s.filter((_,i) => i !== taskIndex));
  }

  toggleSubtaskState(name: string) {
    this.#subtasks.update(s => s.map(t => {
      if(t.name !== name) return t;

      t.state = t.state === TaskState.Active
        ? TaskState.Finished
        : TaskState.Paused;

      return t;
    }));
  }

  renameSubtask(newName: string, name: string) {
    this.#subtasks.update(s => s.map(t => {
      if(t.name === name) t.name = newName;

      return t;
    }));
  }
}

export class Task extends SubtaskManager {
  #timespans = writable<TimeSpan[]>([]);
  #timeManager = new TimeManager(this.#timespans);

  state: TaskState = TaskState.Active;
  description: string = '';

  constructor(
    public name: string,
  ) { super(); }

  get timeSpans() {
    return readonly(this.#timespans);
  }

  end() {
    this.#timeManager.stop();
  }

  addDescription() {}

  rename(newName: string) {
    this.name = newName;
    console.log(this);
  }
}

export class TaskManager {
  #taskList = writable<Task[]>([]);
  #activeTask = writable<Task|null>(null);

  get taskList(): Readable<Task[]> {
    return readonly(this.#taskList);
  }

  get activeTask(): Readable<Task|null> {
    return readonly(this.#activeTask);
  }

  get #_activeTask(): Task|null {
    return get(this.#activeTask);
  }

  startTask(taskName: string) {
    if(!this.#_activeTask) return;

    const newTask = new Task(taskName);
    this.#activeTask.set(newTask);
  }

  stopTask() {
    const activeTask = this.#_activeTask;
    if(!activeTask) return;

    this.#_activeTask.end();
    this.#taskList.update((tasks) => [...tasks, activeTask]);

    this.#activeTask.set(null);
  }

  resumeTask(timeSpans: TimeSpan[]) {
    // coming soon
  }
}

export const taskManager = new TaskManager();
