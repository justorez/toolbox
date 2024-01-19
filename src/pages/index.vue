<script setup lang="ts">
const entrances = [
    { text: '文字编码器', url: '/codec' },
    { text: '基金补仓计算器', url: '/funds' }
]
</script>

<template>
    <div class="flex justify-center gap-5">
        <RouterLink
            v-for="entry in entrances"
            :key="entry.url"
            :to="entry.url"
            role="button"
            class="btn btn-outline"
        >
            {{ entry.text }}
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped></style>
