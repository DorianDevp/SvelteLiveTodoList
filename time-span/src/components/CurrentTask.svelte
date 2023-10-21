<script lang="ts">
    import { get, type Writable } from "svelte/store";
    import type { Task  } from "../utlis/TaskManager";
    import { TaskState } from "../utlis/TaskManager";
    import LoadingDots from "./LoadingDots.svelte";
  import { afterUpdate, beforeUpdate } from "svelte";

    export let activeTask: Task;

    const { subTasksManager, timeManager } = activeTask;
    const { subTasks } = subTasksManager;
    const { timeSpans } = timeManager;

    let subTaskName: string = '';


    const addSubtask = () => {
        subTasksManager.add(subTaskName);
    }
    const deleteSubtask = () => {
        subTasksManager.delete(subTaskName);
    }

</script>

<div class="active-task">
    <div class="dashboard">
        <h3>{activeTask.name}</h3>
        <div class="time">
            {#if $timeSpans?.length > 0}
                {#each $timeSpans as time}
                    <div class="span">
                        <p>{time.started}</p>
                        {#if time.finished}
                            <p>{time.finished}</p>
                        {:else}
                            <LoadingDots />
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
        <!-- <p
            class="state"
            class:active={$task.state === TaskState.Active}
            class:paused={$task.state !== TaskState.Active} >
            {$task.state}
        </p> -->
    </div>
    <div class="subtasks">
        <div class="add">
            <input type="text" placeholder="write your subtask +" bind:value={subTaskName}>
            <button on:click={ addSubtask }>Add subtask</button>
        </div>
        {#if $subTasks?.length > 0}
            <div class="list">
                {#each $subTasks as sub}
                    <div class="sub">
                        <p>{sub}</p>
                        <button class="del"
                            on:click={ deleteSubtask }>
                            DEL
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @import '../styles/colors.scss';

    .active-task {
        padding: 15px;
        background-color: $darker-main;
        border-radius: 10px;

        h3 {
            margin-bottom: 15px;
            font-size: 24px;
        }

        p {
            &.state {
                margin-left: auto;
            }
            &.active {
                color: $theme-green
            }

            &.paused {
                color: #d4851e;
            }
        }

        .dashboard {
            display: flex;
            align-items: center;
            gap: 15px;

            .time {
                .span {
                    display: flex;
                    gap: 10px;
                }
            }
        }
        .subtasks {
            .add {
                display: flex;
                flex-wrap: nowrap;
                gap: 10px;

                input {
                    width: 100%;
                }
                button {
                    width: 30%;
                }
            }
            .list {
                display: flex;
                flex-direction: column;
                margin-top: 15px;
                padding: 10px;
                border: 1px solid $bright-main;
                border-radius: 10px;

                .sub {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid $bright-main;

                    &:last-child {
                        border: none;
                    }
                    p {
                        color: $bright-main;
                    }
                    .del {
                        font-size: 12px;
                        background-color: $theme-red;
                    }
                }
            }
        }
    }
</style>