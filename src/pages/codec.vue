<script lang="ts" setup>
import { Buffer } from 'buffer/'

const Codec = {
    Xhinese: { // 我是 Justorez 😄，How are you.
        encode: (s: string) => {
            return s.split('')
                .map(c => /^[\u4e00-\u9fa5]+$/.test(c)
                    ? String.fromCharCode(c.charCodeAt(0) + 1)
                    : c
                )
                .join('')
        },
        decode: (s: string) => {
            return s.split('')
                .map(c => /^[\u4e00-\u9fa5]+$/.test(c)
                    ? String.fromCharCode(c.charCodeAt(0) - 1)
                    : c
                )
                .join('')
        },
        desc: '😅让人疑惑的中文，当然也让控评机器人疑惑'
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
type CodecKeys = keyof typeof Codec

// 编码算法
const algos = Object.keys(Codec)
const selected = ref<CodecKeys>('Xhinese')
const selectAlgo = (t: CodecKeys) => selected.value = t
const algoDesc = computed(() => Codec[selected.value].desc)

const content = ref('')
const encode = () => {
    content.value = Codec[selected.value].encode(content.value) || ''
}
const decode = () => {
    content.value = Codec[selected.value].decode(content.value) || ''
}

const clean = () => content.value = ''
const copy = () => {
    navigator.clipboard.writeText(content.value)
}
const restoreIcon = (event: Event) => {
    setTimeout(() => {
        (event.target as HTMLInputElement).checked = false
    }, 1200)
}
</script>

<template>
    <div class="toolapp">
        <div class="flex gap-2">
            <button 
                v-for="algo in algos"
                :key="algo"
                class="btn btn-sm"
                :class="{
                    'btn-outline': selected !== algo,
                    'btn-neutral': selected === algo
                }"
                @click="selectAlgo(algo as CodecKeys)"
            >
                {{ algo }}
            </button>
        </div>
        <div class="mt-4 mb-4">
            <textarea 
                v-model="content"
                class="textarea textarea-bordered w-full" 
                rows="6"
                :placeholder="algoDesc"
            ></textarea>
        </div>
        <div class="flex justify-between items-center">
            <div class="flex gap-2">
                <button class="btn btn-sm" @click="encode">Encode</button>
                <button class="btn btn-sm" @click="decode">Decode</button>
            </div>
            <div class="flex gap-2">
                <i-mdi:restore class="cursor-pointer" @click="clean"/>
                <label class="swap swap-rotate cursor-pointer" @click="copy">
                    <input type="checkbox" @change="restoreIcon($event)"/>
                    <i-mdi:content-copy class="swap-off"/>
                    <i-mdi:check class="swap-on text-success"/>
                </label>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>