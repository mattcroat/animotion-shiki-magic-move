import { getHighlighter } from 'shiki'

const themes = ['poimandres']
const langs = ['javascript', 'typescript', 'svelte']
const highlighter = await getHighlighter({ themes, langs })

export default highlighter
