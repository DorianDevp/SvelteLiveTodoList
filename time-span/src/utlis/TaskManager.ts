import { time } from "../stores/stores";
import { get, writable } from 'svelte/store';
import type { Writable, Updater } from "svelte/store";

interface TaskHistory {
    session: Task[];
    date: string;
};

export interface Task {
    name: string;
    state: TaskState;
    subTasks: string[];
    timeSpans: TimeSpan[];
};

interface TimeSpan {
    started: string;
    finished: null|string;
};

export enum TaskState {
    Active = 'active',
    Paused = 'paused',
    Finished = 'finished'
};

class SubTaskManager {
    subTasks: Writable<string[]> = writable([]);

    addSubTask(name: string): void {
        this.subTasks.update(tasks => tasks = [...tasks, name])
    }

    deleteSubTask(name: string): void {
        this.subTasks.update(tasks => {
            tasks = tasks.filter(task => task !== name)

            return tasks
        })
    }

    renameSubTask(newName: string): void {
    }
}

export class ActiveTask extends SubTaskManager {
    constructor(
        public name: string,
        public state: TaskState = TaskState.Active,
        public timeSpans: TimeSpan[] = [{
            started: get(time).format('HH:mm:ss'),
            finished: null
        }],
    ) {
        super();
        this.task = writable(this);
    }

    task: Writable<ActiveTask>;

    end(): void {
        this.timeSpans.findLast(span => span.finished = get(time).format('HH:mm:ss'))
        this.task.set(this);
    }

    rename(newName: string) {
        this.name = newName;
        this.task.set(this);
    }
}

export class TaskManager  {
    taskList: Writable<ActiveTask[]> = writable([]);
    activeTask: Writable<ActiveTask|null> = writable(null);

    addTask(taskName: string): void {
        this.activeTask.set(new ActiveTask(taskName));
    }

    stopTask() {
        if(!get(this.activeTask)?.end) return;

        get(this.activeTask)!.end();
        this.taskList.update(tasks => tasks = [...tasks, get(this.activeTask) as ActiveTask]);

        this.activeTask.set(null);
    }

    reactivateTask(timeSpans: TimeSpan[]): void {
        const selectedTask = get(this.taskList)
            .find(task => task.timeSpans === timeSpans);
        if(selectedTask) {
            this.activeTask.set(selectedTask);
            this.taskList.update(tasks => {
                tasks = tasks.filter(el => el !== selectedTask);

                return tasks;
            });
        }
    }
}

export const taskManager = new TaskManager();