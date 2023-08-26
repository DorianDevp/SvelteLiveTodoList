<script lang="ts">
  import { get, type Writable } from "svelte/store";
    import { taskManager, TaskState } from "../utlis/TaskManager";
    import LoadingDots from "./LoadingDots.svelte";
    import CurrentTask from "./CurrentTask.svelte";

    let taskName: string = '';

    let { taskList, activeTask } = taskManager;

</script>

<h2 style="margin: 0;">ToDo</h2>
<input type="text" disabled={$activeTask?.state === TaskState.Active} bind:value={taskName}>
{#if $activeTask?.state === TaskState.Active}
    <button class="stop" on:click={() => taskManager.stopTask()}>STOP</button>
{:else}
    <button on:click={() => taskManager.addTask(taskName)}>START</button>
{/if}
{#if $activeTask !== null}
    <CurrentTask activeTask={$activeTask}/>
{/if}
<div class="task-list">
    {#each $taskList as task}
        <div>{task.name}</div>
        <div class="time">
            {#each task.timeSpans as time}
                <p>{time.started}</p>
                <p>{time.finished}</p>
            {/each}
        </div>
        <button on:click={() => taskManager.reactivateTask(task.timeSpans)}>⏪</button>
    {/each}
</div>

<style lang="scss">
    @import '../styles/colors.scss';

    .active-task {
        background-color: $darker-main;
        padding: 15px;
        border-radius: 10px;

        h3 {
            margin-bottom: 10px;
            font-size: 24px;
        }
    }
    .task-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: $darker-main;
        border-radius: 10px;

        .time {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }
</style>














<!-- <input type="text"
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
</style> -->