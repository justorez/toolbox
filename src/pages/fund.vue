<route lang="json">
{
    "meta": {
        "title": "基金补仓计算器"
    }
}
</route>
<script setup lang="ts">
import NP from 'number-precision'

let form = reactive({
    holdingCost: 0,
    holdingShares: 0,
    netAssetValue: 0,
    replenishmentAmount: 0
})
let result = reactive({
    holdingIncome: 0,
    holdingYield: 0,
    expectedHoldingYield: 0,
    expectedHoldingCost: 0
})
const initialForm = { ...toRaw(form) }
const initialResult = { ...toRaw(result) }

function resultClass(val: number) {
    return val === 0 ? '' : val > 0 ? 'text-error' : 'text-success'
}

function submit() {
    const gap = NP.minus(form.netAssetValue, form.holdingCost)
    const holdingIncome = NP.times(form.holdingShares, gap)
    result.holdingIncome = NP.round(holdingIncome, 2)

    const holdingYield = NP.divide(gap, form.holdingCost)
    result.holdingYield = NP.times(NP.round(holdingYield, 4), 100)

    const total = NP.plus(
        NP.times(form.holdingCost, form.holdingShares),
        form.replenishmentAmount
    )
    const shares = NP.plus(
        form.holdingShares,
        NP.divide(form.replenishmentAmount, form.netAssetValue)
    )
    const expectedHoldingCost = NP.divide(total, shares)
    result.expectedHoldingCost = NP.round(expectedHoldingCost, 4)

    const expectedHoldingYield = NP.divide(
        NP.minus(form.netAssetValue, expectedHoldingCost),
        form.holdingCost
    )
    result.expectedHoldingYield = NP.times(
        NP.round(expectedHoldingYield, 4),
        100
    )
}
function reset() {
    Object.assign(form, initialForm)
    Object.assign(result, initialResult)
}
</script>

<template>
    <div class="toolapp">
        <div class="mb-5 text-lg font-bold">基金补仓计算器</div>
        <div class="flex flex-col gap-3">
            <div class="form-item">
                <label for="">持仓成本价</label>
                <input class="form-input" type="number" v-model="form.holdingCost" />
            </div>
            <div class="form-item">
                <label for="">持有份额</label>
                <input class="form-input" type="number" v-model="form.holdingShares" />
            </div>
            <div class="form-item">
                <label for="">当前基金净值</label>
                <input class="form-input" type="number" v-model="form.netAssetValue" />
            </div>
            <div class="form-item">
                <label for="">补仓金额</label>
                <input class="form-input" type="number" v-model="form.replenishmentAmount" />
            </div>
            <div class="flex justify-end gap-3">
                <button class="btn btn-outline" @click="reset">重置</button>
                <button class="btn btn-neutral" @click="submit">计算</button>
            </div>
        </div>
        <div class="result">
            <div class="cell">
                <span class="text">持有收益</span>
                <span class="value" :class="resultClass(result.holdingIncome)">
                    {{ result.holdingIncome || '' }}
                </span>
            </div>
            <div class="cell">
                <span class="text">原持有收益率</span>
                <span class="value" :class="resultClass(result.holdingYield)">
                    {{ result.holdingYield || '' }}%
                </span>
            </div>
            <div class="cell">
                <span class="text">预计持仓成本价</span>
                <span class="value">{{ result.expectedHoldingCost || '' }}</span>
            </div>
            <div class="cell">
                <span class="text">预计持有收益率</span>
                <span
                    class="value"
                    :class="resultClass(result.expectedHoldingYield)"
                >
                    {{ result.expectedHoldingYield || '' }}%
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.form-item {
    display: flex;
    justify-content: space-between;
}
.form-input {
    @apply input input-bordered input-sm;
}

.result {
    margin-top: 20px;
    padding: 1em;
    border-radius: 8px;
    border: 2px dashed #efefef;
}
.cell {
    display: flex;
    justify-content: space-between;
}
.cell .value {
    opacity: 0.8;
}
</style>
