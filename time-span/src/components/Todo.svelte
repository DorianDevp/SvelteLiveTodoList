<script lang="ts">
    import { get, type Writable } from "svelte/store";
    import { Task, TaskManager, taskManager, TaskState } from "../utlis/TaskManager";
    import LoadingDots from "./LoadingDots.svelte";
    import CurrentTask from "./CurrentTask.svelte";

    let taskName: string = '';

    let { taskList, activeTask }: Partial<TaskManager> = taskManager;

</script>

<h2 style="margin: 0;">ToDo</h2>
<input type="text"
    disabled={$activeTask?.state === TaskState.Active}
    bind:value={taskName}>

{#if $activeTask?.state === TaskState.Active}
    <button class="stop"
        on:click={() => taskManager.stopTask()}>
        STOP
    </button>
{:else}
    <button on:click={() => taskManager.addTask(taskName)}>START</button>
{/if}

{#if $activeTask !== null}
    <CurrentTask activeTask={ $activeTask }/>
{/if}

<div class="task-list">
    {#each $taskList as task}
        <div>
            <div>{task.name}</div>
            <div class="time">
                {#each get(task.timeManager.timeSpans) as time}
                    <p>{time.started}</p>
                    <p>{time.finished}</p>
                {/each}
            </div>
        </div>
        <!-- <button on:click={() => taskManager.reactivateTask(task.timeSpans)}>⏪</button> -->
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
        flex-direction: column;
        gap: 10px;

        padding: 10px;
        background-color: $darker-main;
        border-radius: 10px;

        .time {
            display: flex;
            gap: 10px;
        }
    }
</style>


