<script lang="ts">
  import type { Readable } from "svelte/store";

  import LoadingDots from "../LoadingDots.svelte";

  import type { TimeSpan } from "../../utlis/TaskManager"

  export let timeSpans: Readable<TimeSpan[]>;
</script>

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

<style lang="scss">
.time {
  .span {
    display: flex;
    gap: 10px;
  }
}
</style>