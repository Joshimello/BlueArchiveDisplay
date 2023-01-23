<script lang="ts">
import { onMount } from 'svelte'

const baseUrl = 'https://raw.githubusercontent.com/Joshimello/BlueArchiveScrape/main/'
const request = new XMLHttpRequest()
request.open('GET', baseUrl + 'weapon_list.json', false)
request.send(null)

let weaponList = JSON.parse(request.responseText)

let selected
let previous
let scene

onMount(async () => {
	let res = await import('./scene.ts')
	res.loadAll(weaponList, baseUrl + 'weapons/')
	scene = res.scene
})

const show = (obj, pre) => {
	if (scene) {
		scene.getObjectByName(obj).visible = true
		if (pre) {
			scene.getObjectByName(pre).visible = false
		}
	}
}

$: {
	show(selected, previous)
	previous = selected
}

</script>

<main>
	<select bind:value={selected}>
		{#each weaponList as i}
		<option value={i}>{i}</option>
		{/each}
	</select>
</main>

<canvas id="bg"></canvas>

<style>
	main {
		position: fixed;
	}

	div{
		display: flex;
		flex-direction: column;
		overflow: unset;
	}

	canvas { overflow: hidden; }
</style>