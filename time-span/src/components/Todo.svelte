<script lang="ts">
    import Loading from "./LoadingDots.svelte";
    export let currentLocaleTime: string;

    interface Task {
        taskName: string,
        timeSpan: TimeSpan[]
    };
    interface TimeSpan {
        started: string,
        ended: null|string,
    }

    let taskList: Task[] = [];

    $: currentTask = '';

    $: taskStarted = false;

    $: pause = false;

    $: optionsShown = false;

    class TaskManager {
        static addTask(taskName: string) {
            taskStarted = true;
            const newTask: Task = {
                taskName: taskName,
                timeSpan: [{
                    started: currentLocaleTime,
                    ended: null
                }]
            }
            taskList = [...taskList, newTask];
        }

        static endTask() {
            if (!pause) {
                taskList.findLast((task: Task) => {
                    if (task.taskName === currentTask) {
                        task.timeSpan.findLast((span) => span.ended = currentLocaleTime);
                    }
                });
                taskList = taskList;
            }
            taskStarted = false;
        }

        static pauseTask() {
            pause = true;
            taskList.findLast((task: Task) => {
                task.timeSpan.findLast((span) => span.ended = currentLocaleTime);
            });
            taskList = taskList;
        }

        static unpauseTask() {
            pause = false
            taskList.findLast((task: Task) => {
                task.timeSpan = [...task.timeSpan, {started: currentLocaleTime, ended: null}];
            });
            taskList = taskList;
        }

        static reactivateTask(task: Task) {
            taskStarted = true;
            const taskIndex = taskList.indexOf(task);
            taskList.push(taskList.splice(taskIndex, 1)[0]);
            taskList.find((_task: Task) => {
                if (_task === task) {
                    task.timeSpan = [...task.timeSpan, {started: currentLocaleTime, ended: null}];
                }
            });
            taskList = taskList;
        }

        static showOptions() {
            optionsShown = !optionsShown;
        }
    }

</script>

<input type="text"
    disabled={taskStarted}
    placeholder="Write your task..."
    bind:value={currentTask}
    on:keyup={(event) =>  event.key === "Enter" ? TaskManager.addTask(currentTask) : ''}>
{#if  !taskStarted}
    <button on:click={() => TaskManager.addTask(currentTask)}>Add Task +</button>
{:else}
    <button class="task-ender" on:click={() => TaskManager.endTask()}>End Task 😮‍💨</button>
    {#if !pause}
        <button class="task-pauser" on:click={() => TaskManager.pauseTask()}>Pause ✋</button>
    {:else}
        <button class="task-pauser" on:click={() => TaskManager.unpauseTask()}>Unpause 🫡</button>
    {/if}
{/if}
{#if taskList[0]}
    <div class="task-wrapper">
        {#each taskList as task }
            <div class="task-container">
                <p>{task.taskName}</p>
                <div class="time-wrapper">
                    {#each task.timeSpan as {started, ended} }
                        <div class="time-box">
                            <p>{started}</p>
                            {#if ended}
                                <p>{ended}</p>
                            {:else}
                                <Loading/>
                            {/if}
                        </div>
                    {/each}
                </div>
                {#if !taskStarted}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="more" on:click={() => TaskManager.showOptions()}>
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>

                        {#if optionsShown}
                            <div class="options">
                                <button class="option-button" on:click={() => TaskManager.reactivateTask(task)}>Reactivate</button>
                                <button>Incoming feature</button>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">
    .more {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        aspect-ratio:  1;
        gap: 3px;
        background-color: #333852;
        padding: 10px;
        border-radius: 50%;
        transition: .1s;

        &:hover {
            cursor: pointer;
            background-color: #aaaaaa;
        }

        .dot {
            width: 5px;
            height: 5px;
            background-color: #1b1e2d;
            border-radius: 50%;
            margin-top: 150%;
        }
    }
    .options {
        transform: translateX(54%);
        position: absolute;
        background-color: #1b1e2d;
        border: 1px solid #6a7199;
        border-radius: 10px;

        button {
            background-color: transparent;
            color: white;
            font-weight: 100;
            font-size: 16px;
            border-radius: 0px;
            border-bottom: 1px solid #6a7199;

            &:last-child {
                border: none;
            }
        }
    }

    .task-wrapper {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: rgb(27, 30, 45);
        border-radius: 10px;
    }
    .task-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 5px;
        border-bottom: 1px solid rgb(106, 113, 153);
    }
    .task-ender {
        background-color: #dc4343;
        color: #462727;
    }
    .task-ender:hover {
        background-color: #942828;;
    }
    .task-pauser {
        background-color: #ff9538;
        color: #462727;
    }
    .task-pauser:hover {
        background-color: #946b28;;
    }
    .time-wrapper {
        display: flex;
        flex-direction: column;
    }
    .time-box {
        display: flex;
        gap: 10px;
    }
</style>