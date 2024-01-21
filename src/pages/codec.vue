<route lang="json">
{
    "meta": {
        "title": "文字编码器"
    }
}
</route>
<script lang="ts" setup>
import { Buffer } from 'buffer/'
import EMOJIS from '@/utils/emojis.json'

const EMOJI_CODES = EMOJIS.reduce((o, emoji, i) => {
    o[emoji] = i
    return o
}, {} as Record<string, number>)

const Codec = {
    Emoji: {
        encode: (s: string) => {
            let result: string[] = []
            for (const c of [ ...s ]) {
                Buffer.from(c)
                    .toJSON()
                    .data.forEach((code) => {
                        result.push(EMOJIS[code])
                    })
            }
            return result.join('')
        },
        decode: (s: string) => {
            const codes = [ ...s ].map((emoji) => EMOJI_CODES[emoji])
            return Buffer.from(codes).toString()
        },
        desc: '把文字变成表情😉'
    },
    混乱中文: {
        // Hi, 我是 Justorez 😄。
        encode: (s: string) => {
            return [...s]
                .map((c) =>
                    /^[\u4e00-\u9fa5]+$/.test(c)
                        ? String.fromCharCode(c.charCodeAt(0) + 1)
                        : c
                )
                .join('')
        },
        decode: (s: string) => {
            return [...s]
                .map((c) =>
                    /^[\u4e00-\u9fa5]+$/.test(c)
                        ? String.fromCharCode(c.charCodeAt(0) - 1)
                        : c
                )
                .join('')
        },
        desc: '让人疑惑的中文'
    },
    Base64: {
        encode: (s: string) => Buffer.from(s).toString('base64'),
        decode: (s: string) => Buffer.from(s, 'base64').toString(),
        desc: ''
    },
    Hex: {
        encode: (s: string) => Buffer.from(s).toString('hex'),
        decode: (s: string) => Buffer.from(s, 'hex').toString(),
        desc: ''
    },
    URL: {
        encode: (s: string) => encodeURIComponent(s),
        decode: (s: string) => decodeURIComponent(s),
        desc: ''
    }
}
type Encodings = keyof typeof Codec

const encodings = Object.keys(Codec)
const selected = ref<Encodings>('Emoji')
const selectAlgo = (t: Encodings) => (selected.value = t)
const encodingDesc = computed(() => Codec[selected.value].desc)

const content = ref('')
const encode = () => {
    content.value = Codec[selected.value].encode(content.value) || ''
}
const decode = () => {
    content.value = Codec[selected.value].decode(content.value) || ''
}

const clean = () => (content.value = '')
const copy = async () => {
    try {
        await navigator.clipboard.writeText(content.value)
    } catch (err) {
        console.error(err)
        const input = document.createElement('input')
        input.value = content.value
        document.body.append(input)
        input.select()
        document.execCommand('copy')
        input.remove()
    }
}
const restoreIcon = (event: Event) => {
    setTimeout(() => {
        ;(event.target as HTMLInputElement).checked = false
    }, 1200)
}
</script>

<template>
    <div class="toolapp">
        <div class="flex gap-2">
            <button
                v-for="enc in encodings"
                :key="enc"
                class="btn btn-sm"
                :class="{
                    'btn-outline': selected !== enc,
                    'btn-neutral': selected === enc
                }"
                @click="selectAlgo(enc as Encodings)"
            >
                {{ enc }}
            </button>
        </div>
        <div class="mt-4 mb-4">
            <textarea
                v-model="content"
                class="textarea textarea-bordered w-full"
                rows="6"
                :placeholder="encodingDesc"
            ></textarea>
        </div>
        <div class="flex justify-between items-center">
            <div class="flex gap-2">
                <button class="btn btn-sm" @click="encode">Encode</button>
                <button class="btn btn-sm" @click="decode">Decode</button>
            </div>
            <div class="flex gap-2">
                <i-mdi:restore class="cursor-pointer" @click="clean" />
                <label class="swap swap-rotate cursor-pointer" @click="copy">
                    <input type="checkbox" @change="restoreIcon($event)" />
                    <i-mdi:content-copy class="swap-off" />
                    <i-mdi:check class="swap-on text-success" />
                </label>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
