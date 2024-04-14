<script lang="ts">
	import { onMount } from 'svelte'
	import { type BundledLanguage, type SpecialLanguage } from 'shiki'
	import {
		codeToKeyedTokens,
		createMagicMoveMachine,
	} from 'shiki-magic-move/core'
	import { MagicMoveRenderer } from 'shiki-magic-move/renderer'
	import type {
		MagicMoveDifferOptions,
		MagicMoveRenderOptions,
	} from 'shiki-magic-move/types'
	import highlighter from './highlighter'

	type PromiseFunction = () => Promise<void>

	export let code: string
	export let lang: BundledLanguage | SpecialLanguage
	export let theme = 'poimandres'
	export let options: MagicMoveRenderOptions & MagicMoveDifferOptions = {}

	delete $$restProps.class

	let container: HTMLPreElement
	let machine: ReturnType<typeof createMagicMoveMachine>
	let renderer: MagicMoveRenderer
	let ready = false

	const is = {
		htmlEl: (el: Element): el is HTMLElement => el instanceof HTMLElement,
		token: (el: HTMLElement) => el.className.includes('shiki-magic-move-item'),
		newLine: (el: HTMLElement) => el.tagName === 'BR',
		match: (el: HTMLElement, selection: string) => {
			return el.innerHTML.includes(selection)
		},
	}

	function indent(string: string) {
		const tabs = string
			.split('\n')
			.filter(Boolean)[0]
			.split('')
			.filter((char) => char === '\t')
			.join('')
		return string
			.split(/(\n)/)
			.map((line) => line.replace(tabs, ''))
			.join('')
			.trim()
	}

	async function init() {
		machine = createMagicMoveMachine(
			(code) => codeToKeyedTokens(highlighter, code, { lang, theme }),
			options
		)
		renderer = new MagicMoveRenderer(container)
		Object.assign(renderer.options, options)
		const result = machine.commit(indent(code))
		renderer.render(result.current)
		ready = true
	}

	async function render(code: string) {
		if (!ready) return
		const result = machine.commit(indent(code))
		if (result.previous) renderer.replace(result.previous)
		await renderer.render(result.current)
	}

	export function update(code: TemplateStringsArray) {
		return render(code[0])
	}

	function getLines(string: TemplateStringsArray) {
		let range = string[0]
		if (range === '*') return []
		return range.split(',').flatMap((v) => v.split('-').map(Number))
	}

	function transition(el: HTMLElement, selected: boolean) {
		// @ts-expect-error
		const { promise, resolve } = Promise.withResolvers()
		const selectedToDeselect = !selected && el.classList.contains('selected')
		const deselectedToSelect = selected && el.classList.contains('deselected')
		const nothingToDeselect =
			!selected &&
			!el.classList.contains('deselected') &&
			!el.classList.contains('deselected')
		const willTransition =
			selectedToDeselect || deselectedToSelect || nothingToDeselect
		willTransition ? (el.ontransitionend = resolve) : resolve()
		el.classList.toggle('selected', selected)
		el.classList.toggle('deselected', !selected)
		return promise
	}

	export function selectLines(string: TemplateStringsArray) {
		const lines = getLines(string)
		const children = container.children
		const promises: PromiseFunction[] = []

		let currentLine = 1
		for (const child of children) {
			if (!is.htmlEl(child)) return
			if (is.token(child)) {
				let selected = false
				lines.length === 0
					? (selected = true)
					: (selected = lines.includes(currentLine))
				promises.push(transition(child, selected))
			}
			if (is.newLine(child)) currentLine++
		}
		return Promise.all(promises)
	}

	export function selectAll(string: TemplateStringsArray) {
		const selection = string[0]
		const children = container.children
		const promises: PromiseFunction[] = []

		let currentLine = 1
		for (const child of children) {
			if (!is.htmlEl(child)) return
			if (is.token(child)) {
				const selected = is.match(child, selection)
				promises.push(transition(child, selected))
			}
			if (is.newLine(child)) currentLine++
		}
		return Promise.all(promises)
	}

	onMount(init)
</script>

<pre
	bind:this={container}
	class="shiki-magic-move-container {$$props.class || ''}"
	{...$$restProps}></pre>

<style>
	pre {
		text-align: left;
	}
</style>
