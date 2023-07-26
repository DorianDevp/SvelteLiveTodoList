<script lang="ts">
    import { onMount } from "svelte";
    import Todo from "../components/Todo.svelte";

    let workTime: string | Number;
    let timeFullfilled: null | string = null;
    let timeRemaing: null | Date = null;
    let addedTime: number|string;

    $: currentDate = new Date();
    $: endOfTheDay = addMinutesToCurrentDate(workTime);
    $: dateStarted = false;


    function startTimer() {
        let i = 0;
        const interval = setInterval(() => {
            startDay(interval);
            timeFullfilled = `${(i++ * 100)/ (Number(workTime)*3600)}%`;
        }, 1000);

        startDay(interval);
    }

    function startDay(dayFinisher: number) {
        timeRemaing = setTimeRemaining();
        if (timeRemaing !== null) {
            dateStarted = true;
            currentDate = new Date();
        } else {
            dateStarted = false;
            clearInterval(dayFinisher);
        }
    }

    function setTimeRemaining(): null|Date {
        let timeDiff: null|Date = new Date(endOfTheDay.getTime() - currentDate.getTime());
        if (timeDiff.getTime() <= 0) {
            return null
        }
        timeDiff.setMinutes(timeDiff.getMinutes() - 60);

        return timeDiff
    };

    function addMinutesToCurrentDate (minutes: Number|string|null): Date {
        const date: Date = new Date();
        date.setMinutes(date.getMinutes() + Number(minutes)*60);

        return date
    };

    function addTimeToYourDay(minutes: Number|string) {
        endOfTheDay.setMinutes(endOfTheDay.getMinutes() + Number(minutes)*60);
        endOfTheDay = endOfTheDay;
    }

</script>

<div class="container">
    <div class="wrapper">
        {#if !dateStarted}
            <h3>How many hours will you work?</h3>
            <input type="number" bind:value={workTime} />
            <button
                on:click={() => startTimer()}>
                Start your day ⌛️
            </button>
        {:else if dateStarted && timeRemaing !== null}
            <div class="time-spans">
                <div class="time-span"></div>
                <div class="time-fullffilled" style="width: {timeFullfilled};"></div>
            </div>
            <div class="time-content">
                <p class="time-remaining">Time left: <span>{timeRemaing.toLocaleTimeString()}</span></p>
                <p class="time-remaining">End at: <span>{endOfTheDay.toLocaleTimeString()}</span></p>
            </div>
            <div class="add-time">
                <input type="number" placeholder="Type time to add" bind:value={addedTime}>
                <button on:click={() => addTimeToYourDay(addedTime)}>Add time</button>
            </div>
        {/if}
    </div>
    {#if dateStarted && timeRemaing !== null}
        <div class="wrapper">
            <Todo currentLocaleTime={currentDate.toLocaleTimeString()}></Todo>
        </div>
    {/if}
</div>

<style lang="scss">
    $theme-red: #f37d7d;
    $theme-green: #09e083;
    $theme-bright-green: #757eab;
    $theme-green-hoover: #057f4a;
    $theme-dark-green: #0a3e07;
    $darker-main: #1b1e2d;
    $lighter-main: rgb(51, 56, 82);
    $main: #333852;
    $bright-main: #6a7199;
    $inactive-main: #292d41;

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
    }
    :global(button:hover) {
        background-color: $theme-green-hoover;
    }
    .time-spans {
        position: relative;
    }
    .time-span {
        width: 100%;
        height: 40px;
        background-color: $inactive-main;
        border-radius: 10px;
    }
    .time-fullffilled {
        position: absolute;
        height: 40px;
        background-color: $theme-bright-green;
        border-radius: 10px;
        margin-top: -40px;

    }
    .time-remaining {
        color: $darker-main;
        font-size: 20px;
        font-weight: bold;
    }
    .container {
        display: flex;
        align-items: self-start;
        gap: 40px;
        margin: 0 10%;
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