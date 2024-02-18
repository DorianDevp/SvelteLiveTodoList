<script lang="ts">
  import type { Task } from "../utlis/TaskManager";

  import LoadingDots from "./LoadingDots.svelte";
  import Subtasks from "./Task/Subtasks.svelte";
  import Timespan from "./Task/Timespan.svelte";

  export let activeTask: Task;

  $:( { name, subtasks, timeSpans } = activeTask );

  const subtaskFn = (e: CustomEvent) => {
    const subtaskName: string = e.detail.name;

    if(!subtaskName) return console.log('Nie znaleziono imienia');

    return {
      add:    () => activeTask.addSubtask(subtaskName),
      delete: () => activeTask.deleteSubtask(subtaskName),
      toggle: () => activeTask.toggleSubtaskState(subtaskName)
    }
  };

</script>

<div class="active-task">
  <div class="dashboard">
    <h3>{ activeTask.name }</h3>

    <Timespan timeSpans={ timeSpans } />
    <!-- <p
            class="state"
            class:active={$task.state === TaskState.Active}
            class:paused={$task.state !== TaskState.Active} >
            {$task.state}
        </p> -->
  </div>
  <Subtasks subtasks={ subtasks }
    on:add=   { (e) => subtaskFn(e)?.add() }
    on:delete={ (e) => subtaskFn(e)?.delete() }
    on:toggle={ (e) => subtaskFn(e)?.toggle() } />
</div>

<style lang="scss">
  @import "../styles/colors.scss";

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
        color: $theme-green;
      }

      &.paused {
        color: #d4851e;
      }
    }

    .dashboard {
      display: flex;
      align-items: center;
      gap: 15px;
    }
  }
</style>
