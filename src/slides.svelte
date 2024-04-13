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

		await code.selectAll`count`
	}
</script>

<svelte:window on:click={animate} />

<Presentation>
	<Slide class="h-full w-full grid place-content-center">
		<Code
			bind:this={code}
			lang="svelte"
			options={{ duration: 1000, stagger: 3 }}
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
