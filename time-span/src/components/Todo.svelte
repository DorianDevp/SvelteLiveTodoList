<script lang="ts">
    export let currentDate: Date;

    interface Task {
        taskContent: string,
        timeStarted: string;
        timeEnded: null|string;
    };

    let taskList: Task[] = [];
    $: currentTask = '';
    $: taskStarted = false;

    function addTask(task: string) {
        taskStarted = true;
        const currentTask: Task = {taskContent: task, timeStarted: currentDate.toLocaleTimeString(), timeEnded: '...' };
        taskList = [...taskList, currentTask];
        console.log(taskList);
    }
    function endTask() {
        taskList.findLast((task: Task) => task.timeEnded = currentDate.toLocaleTimeString() );
        taskList = taskList
        taskStarted = false;
    }

</script>

<input type="text" placeholder="Napisz taska" bind:value={currentTask}>
{#if  !taskStarted}
    <button on:click={() => addTask(currentTask)}>Dodaj taska</button>
{:else}
    <button class="task-ender" on:click={() => endTask()}>Zakończ taska</button>
{/if}

<div class="task-wrapper">
    {#each taskList as {taskContent, timeStarted, timeEnded} }
        <div class="task-container">
            <p>{taskContent}</p>
            <div class="time-wrapper">
                <p>{timeStarted}</p>
                <p>{timeEnded}</p>
            </div>
        </div>
    {/each}
</div>

<style>
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
    .time-wrapper {
        display: flex;
        gap: 10px;
    }
</style>