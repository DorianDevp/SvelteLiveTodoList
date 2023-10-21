import { time } from "../stores/stores";
import { get, writable } from 'svelte/store';
import type { Writable, Updater } from "svelte/store";

interface Session {
    taskList: Task[];
    date: string;
    state: 'active'|'finished';
};

export interface Task {
    name: string;
    state: TaskState;
    subTasks: string[];
    timeManager: TimeManager;
};

interface TimeSpan {
    started: string;
    finished: null|string;
};

export enum TaskState {
    Active = 'active',
    Paused = 'paused',
    Finished = 'finished',
};

class TimeManager {
    constructor(
    ) {
        this.create();
    }

    #timeSpans = writable<TimeSpan[]>([]);
    #activeTimeSpan: TimeSpan|null = null;

    get timeSpans() {
        return this.#timeSpans;
    }

    create() {
        const timespan = {
            started: get(time).format('HH:mm:ss'),
            finished: null
        };

        this.#timeSpans.subscribe(time => {
            this.#activeTimeSpan = time[time.length - 1];
        })

        this.#timeSpans.update(times => [...times, timespan]);
    }

    finish() {
        if(!this.#activeTimeSpan) return;

        this.#activeTimeSpan.finished = get(time).format('HH:mm:ss');
    }

}

class SubtaskManager {
    #subTasks = writable<string[]>([]);

    get subTasks() {
        return this.#subTasks;
    }

    add(name: string) {
        this.#subTasks.update(list => {
            const duplicate = list.find(task => task === name);
            if(duplicate) return list;

            list.push(name);

            return list;
        });
    }

    delete(name: string): void {
        this.#subTasks.update(list => { return list.filter(task => task !== name) });
    }

    rename(newName: string): void {
        // coming soon
    }
}

export class Task {
    constructor(
        public name: string,
        public state: TaskState = TaskState.Active,
        public timeManager = new TimeManager(),
        public subtasksManager = new SubtaskManager(),
    ) {
        // this.name = writable(this.name);
    }

    end(): void {
        this.timeManager.finish();
    }

    rename(newName: string) {
        this.name = newName;
        console.log(this);
    }
}

export class TaskManager  {
    #taskList = writable<Task[]>([]);
    #activeTask = writable<Task | null>(null);

    get taskList() {
        return this.#taskList;
    }

    get activeTask() {
        return this.#activeTask;
    }

    addTask(taskName: string): void {
        const newTask = new Task(taskName);
        this.#activeTask.set(newTask);
    }

    stopTask() {
        const activeTask = get(this.#activeTask)

        if(!activeTask) return;

        activeTask.end();
        this.taskList.update(tasks => [...tasks, activeTask])

        this.#activeTask.set(null);
    }

    reactivateTask(timeSpans: TimeSpan[]): void {
        // coming soon
    }
}

export const taskManager = new TaskManager();