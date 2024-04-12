<script lang="ts">
	import { Presentation, Slide, CodeBlock as Code } from '@components'

	let multiline = `
<script>
	let count = $state(0)
	let double = $derived(count * 2)
<\/script>

<button onclick={() => count++}>
	{count}
</button>
	`.trim()

	async function toggleAnimation() {
		// toggle = !toggle
		// toggle ? code.update`let bool = true;` : code.update`let bool;`

		console.log('start')
		await code.selectLines([2])
		console.log('end')
	}

	let code: any
	// let toggle = false
</script>

<svelte:window on:click={toggleAnimation} />

<Presentation>
	<Slide class="h-full w-full grid place-content-center">
		<Code bind:this={code} lang="svelte" code={multiline} />
	</Slide>
</Presentation>
