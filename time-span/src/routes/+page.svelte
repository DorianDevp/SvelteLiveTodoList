<script lang="ts">
    import { time, endOfTheDay } from "../stores/stores";

    import Todo from "../components/Todo.svelte";
    import TimeAdd from "../components/TimeAdd.svelte";

    let workTime: number = 0;

    $: dateStarted = false;

    function startDay() {
        setEndOfTheDay(workTime);
        dateStarted = true;
    }

    function setEndOfTheDay (hours: number) {
        if (!hours) return 0;
        const endTime = $time.add(hours, 'hour');

        endOfTheDay.set(endTime);
    };
</script>

<div class="container">
    {#if !dateStarted}
        <div class="wrapper">
            <h3>How many hours will you work?</h3>
            <input type="number" bind:value={ workTime } />
            <button
                disabled={ workTime <= 0 }
                on:click={ () => startDay() }>
                Start your day ⌛️
            </button>
        </div>
    {:else if dateStarted && workTime !== null}
        <div class="wrapper">
            <TimeAdd workTime={ workTime } />
        </div>
        <div class="wrapper">
            <Todo />
        </div>
    {/if}
</div>

<style lang="scss">
    @import '../styles/colors.scss';

    :global() {
        font-family: 'Lato';
    }
    :global(h3) {
        margin: 0;
    }
    :global(p) {
        margin: 0;
        font-size: 16px;
    }
    :global(p) span {
        color: white;
        font-size: 16px;
    }
    :global(input) {
        background-color: $darker-main;
        border: 1px solid $bright-main;
        border-radius: 10px;
        padding: 10px;
        color: white;
        font-size: 18px;

        &:disabled {
            background-color: $bright-main;

            &::placeholder {
                color: white;
            }
        }
    }
    :global(input)::placeholder {
        color: $bright-main;
    }
    :global(button) {
        cursor: pointer;
        padding: 10px;
        background-color: $theme-green;
        border: none;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        transition: .1s;
        color: #0a3e07;;

        &.stop {
            background-color: $theme-red;
        }
    }
    :global(button.stop) {
        background-color: $theme-red;
    }
    :global(button:hover) {
        background-color: $theme-green-hoover;
    }
    :global(button[disabled]) {
        cursor: initial;
        background-color: $bright-main;
    }
    .container {
        display: flex;
        flex-direction: column;
        align-items: self-start;
        gap: 40px;
        margin: 0 10%;

        @media (min-width: 1024px) {
            flex-direction: row;
        }

        @media (min-width: 1360px) {
            margin: 0 15%;
        }
    }
    .wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px;
        background-color: rgb(51, 56, 82);
        padding: 20px;
        border-radius: 15px;
    }
    .time-content {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 10px;
    }
    .add-time {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;

        input {
            grid-column: 1/3;
        }
    }
</style>