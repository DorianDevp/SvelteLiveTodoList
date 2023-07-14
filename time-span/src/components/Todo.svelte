<script lang="ts">
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

    function addTask(taskName: string) {
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

    function endTask() {
        if (!pause) {
            taskList.findLast((task: Task) => {
                task.timeSpan.findLast((span) => span.ended = currentLocaleTime)
            });
            taskList = taskList;
        }
        taskStarted = false;
    }

    function pauseTask() {
        pause = true;
        taskList.findLast((task: Task) => {
            task.timeSpan.findLast((span) => span.ended = currentLocaleTime);
        });
        taskList = taskList;
    }

    function unpauseTask() {
        pause = false
        taskList.findLast((task: Task) => {
            task.timeSpan = [...task.timeSpan, {started: currentLocaleTime, ended: null}];
        });
        taskList = taskList;
    }

    function reactivateTask(task: Task) {
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

</script>

<input type="text" disabled={taskStarted} placeholder="Write your task..." bind:value={currentTask}>
{#if  !taskStarted}
    <button on:click={() => addTask(currentTask)}>Add Task +</button>
{:else}
    <button class="task-ender" on:click={() => endTask()}>End Task 😮‍💨</button>
    {#if !pause}
        <button class="task-pauser" on:click={() => pauseTask()}>Pause ✋</button>
    {:else}
        <button class="task-pauser" on:click={() => unpauseTask()}>Unpause 🫡</button>
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
                            <p>{ended}</p>
                        </div>
                    {/each}
                </div>
                <button on:click={() => reactivateTask(task)}>Reactivate</button>
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">
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