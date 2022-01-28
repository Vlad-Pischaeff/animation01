import App from './App.svelte';

let target = document.getElementById("animation01");

const app = new App({
	target: target
});

export default app;