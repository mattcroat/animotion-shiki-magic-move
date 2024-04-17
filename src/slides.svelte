<script lang="ts">
	import { Presentation, Slide, CodeBlock as Code } from '@components'

	let code: Code

	async function animate() {
		await code.update`
			<script>
				let count = $state(0)
				let double = $derived(count * 2)
			<\/script>

			<button onclick={() => count++}>
				{double}
			</button>
		`

		await code.selectLines`2`
		await code.selectLines`2-3`
		await code.selectLines`2-3,7`
		await code.selectLines`*`

		await code.selectToken`6 onclick = { () => count ++ } }>`
		await code.selectToken`6 count ++`
		await code.selectToken`2 count`
		await code.selectToken`2 ( 0 )`
		await code.selectToken`3 double`
		await code.selectToken`3 ( count * 2 )`
		await code.selectToken`double {double}`

		await code.selectLines`*`
	}
</script>

<svelte:window on:click={animate} />

<Presentation>
	<Slide class="h-full w-full grid place-content-center">
		<Code
			bind:this={code}
			class="w-[860px] mx-auto"
			lang="svelte"
			options={{ duration: 1000, stagger: 3 }}
			lines={true}
			code={`
				<script>
					let count = 0
					$: double = count * 2
				<\/script>

				<button on:click={() => count++}>
					{double}
				</button>
			`}
		/>
	</Slide>
</Presentation>
