<script lang="ts">
    import { onMount } from "svelte";
    import Todo from "../components/Todo.svelte";

    interface WorkLifeBalance {
        diffTime: null|Date,
        timeCompletion: null|string;
    };

    let workTime: any = null;
    let timeFullfilled: WorkLifeBalance['timeCompletion'] = null;
    let diff: WorkLifeBalance['diffTime'] = null;

    $: currentDate = new Date();
    $: endOfTheDay = addMinutesToCurrentDate(workTime);
    $: dateStarted = false;

    function startTimer() {
        let i = 0;
        const startDay = setInterval(() => {
            diff = setTimeRemaining();
            if (diff !== null) {
                dateStarted = true;
                currentDate = new Date();
                timeFullfilled = `${(i++ * 100)/ (Number(workTime)*3600)}%`;
            } else {
                dateStarted = false;
                clearInterval(startDay);
            }
        }, 1000);
    }

    function setTimeRemaining(): null|Date {
        let diff: WorkLifeBalance['diffTime'] = new Date(endOfTheDay.getTime() - currentDate.getTime());
        if (diff.getTime() <= 0) {
            return null
        }
        diff.setMinutes(diff.getMinutes() - 60);

        return diff
    };

    function addMinutesToCurrentDate (minutes: Number): Date {
        const date: Date = new Date();
        date.setMinutes(date.getMinutes() + Number(minutes)*60);

        return date
    };

</script>

<div class="container">
    <div class="wrapper">
        {#if !dateStarted}
            <h3>Ile godzin będziesz pracować?</h3>
            <input type="number" min="0,2" bind:value={workTime} />
            <button
                on:click={() => startTimer()}>
                Rozpocznij dzień ⌛️
            </button>
        {:else if dateStarted && diff !== null}
            <div class="time-spans">
                <div class="time-span"></div>
                <div class="time-fullffilled" style="width: {timeFullfilled}"></div>
            </div>
            <div class="time-content">
                <p class="time-remaining">Pozostało: <span>{diff.toLocaleTimeString()}</span></p>
                <p class="time-remaining">Czas zakończenia: <span>{endOfTheDay.toLocaleTimeString()}</span></p>
            </div>
            <Todo currentDate={currentDate}></Todo>
        {/if}
    </div>
</div>

<style>
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
        color: rgb(9, 224, 131);
        font-size: 16px;
    }
    :global(input) {
        background-color: rgb(27, 30, 45);
        border: 1px solid rgb(106, 113, 153);
        border-radius: 10px;
        padding: 10px;
        color: white;
        font-size: 18px;
    }
    :global(input)::placeholder {
        color: rgb(106, 113, 153);
    }
    :global(button) {
        cursor: pointer;
        padding: 10px;
        background-color: rgb(9, 224, 131);
        border: none;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        transition: .1s;
        color: #0a3e07;;
    }
    :global(button:hover) {
        background-color: rgb(5, 127, 74);
    }
    .time-span {
        position: relative;
    }
    .time-span {
        width: 100%;
        height: 40px;
        background-color: rgb(243, 125, 125);
        border-radius: 10px;
    }
    .time-fullffilled {
        position: absolute;
        height: 40px;
        background-color: rgb(172, 243, 125);
        border-radius: 10px;
        margin-top: -40px;
    }
    .time-remaining {
        color: rgb(51, 56, 82);
        font-size: 20px;
    }

    .container {
        background-color: rgb(51, 56, 82);
        margin: 0 20%;
        padding: 20px;
        border-radius: 15px;
    }
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .time-content {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 10px;
        background-color: rgb(27, 30, 45);;
        border-radius: 10px;
    }
</style>