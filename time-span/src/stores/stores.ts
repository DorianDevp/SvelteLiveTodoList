import { readable, writable, type Writable } from "svelte/store";
import dayjs from 'dayjs';

export let endOfTheDay: Writable<Date|null|dayjs.Dayjs> = writable(null)

export const time = readable(dayjs(), function start(set) {
	const interval = setInterval(() => {
		set(dayjs());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});
