<script lang="ts">
    import { time, endOfTheDay } from "../stores/stores";

    import dayjs from "dayjs";
    import relativeTime from 'dayjs/plugin/relativeTime';

    dayjs.extend(relativeTime);

    export let workTime: any;

    $: timeRemaining = $time.to($endOfTheDay);

    $: addedTime = 0;

    $: fulfillement = (timeCount * 100) / (workTime * 3600);

    let timeCount = 0;
    const endDay = () => {
        if (fulfillement >= 100) return null;
    }

    const workDone = setInterval(() => {
        timeCount ++;
        endDay();
    }, 1000);
</script>

<div class="time-spans">
    <div class="time-span"></div>
    <div class="time-fullffilled" style="width: { fulfillement }%;"></div>
</div>
<div class="time-content">
    <p class="time-remaining">End at: <span>{ $endOfTheDay.format('HH:mm:ss') }</span></p>
    <p class="time-remaining">Time left: <span>{ timeRemaining }</span></p>
</div>
<div class="add-time">
    <input
        type="number"
        placeholder="Type time to add"
        bind:value={ addedTime }>
    <!-- <button on:click={() => addTimeToYourDay(addedTime)}>Add time</button> -->
</div>

<style lang="scss">
    @import '../styles/colors.scss';

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
</style>