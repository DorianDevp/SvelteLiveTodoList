<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { TaskState } from "../../utlis/TaskManager"

  import type { Subtask } from "../../utlis/TaskManager";
  import type { Readable } from "svelte/store";

  type DispatchFn = (subtaskName: string) => void;
  type SubtaskEvents = 'add'|'delete'|'toggle';

  export let subtasks: Readable<Subtask[]>;

  const _dispatch = createEventDispatcher();

  const dispatchFnFor = (ev: SubtaskEvents): DispatchFn =>
    (subtaskName: string) => {
      _dispatch(ev, { name: subtaskName });
  };

  const dispatchTable = {
    add:    dispatchFnFor('add'),
    delete: dispatchFnFor('delete'),
    toggle: dispatchFnFor('toggle'),
  };

  let name: string;
</script>

<div class="subtasks">
  <div class="add">
    <input
      type="text"
      placeholder="write your subtask +"
      bind:value={ name } />
    <button on:click={ () => { dispatchTable.add(name); name = ''} }>Add subtask</button>
  </div>

  {#if $subtasks.length > 0}
    <div class="list">
      {#each $subtasks as sub}
        <div class="sub" class:checked={ sub.state === TaskState.Finished }>
          <p>{ sub.name }</p>
          <div class="button-wrapper">
            <button
              class="check"
              on:click={ () => dispatchTable.toggle(sub.name) } >
              Check</button>
            <button class="del"
              on:click={ () => dispatchTable.delete(sub.name) }>DEL</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

</div>

<style lang="scss">
@import "../../styles/colors.scss";

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

    padding: 5px;
    margin-top: 15px;

    border: 1px solid $bright-main;
    border-radius: 10px;

    .sub {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;

      padding: 8px 10px;

      border-bottom: 1px solid $bright-main;

      &.checked {
        p {
          position: relative;
          width: 100%;

          &::after {
            content: "";
            position: absolute;
            left: 0;
            top: 55%;
            height: 2px;
            background: $bright-main;
            width: 100%;
            display: block;
          }
        }

        .button-wrapper {
          button {
            background-color: transparent !important;
            color: $bright-main !important;
            border-color: $bright-main ;
          }
        }
      }

      &:last-child { border: none; }

      p { color: $bright-main; }

      .button-wrapper {
        display: flex;
        gap: 5px;

        button {
          font-size: 14px;
          border: 2px solid $darker-main;

          &.check {
            background-color: $neutral-light; color: $neutral-light-font;
            &:hover { background-color: $neutral-light-hover;}
          }

          &.del {
            background-color: $theme-red; color: $theme-red-font;
            &:hover { background-color: $theme-red-hover;}
          }
        }
      }
    }
  }
}
</style>
