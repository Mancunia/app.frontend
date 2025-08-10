<template>
    <div class="page">
        <div class="periods">
            <div class="item new" @click="() => modals = true">
                <div class="image">
                    <i class='bx  bx-plus-circle'></i>
                </div>
                <div class="detail">
                    Add New Period
                </div>
            </div>
            <div v-for="(period, index) in periods" :key="index" class="item"
                :class="{ 'active': period.status === 'active' }">
                <div class="image">
                    <i class='bx  bx-calendar-check'></i>
                </div>
                <div class="detail">
                    {{ period.month }} - {{ period.year }}
                </div>
            </div>
        </div>
    </div>
    <CommonModal v-model="modals">
        <CommonProgress v-if="sending.isSending" :error="sending.error" :progress="sending.progress"
            :message="sending.message" @done="done" :autoComplete="true" />
        <CommonModalsBody v-else :icon="{
            icon: 'bx bx-calendar-plus',
            fontSize: '30px',
            color: 'black'
        }" text="" :buttons="[{
            loading: false,
            disabled: false,
            onClick: submit,
            type: 'submit',
            classNames: 'primary',
            label: 'Submit'
        }, {
            loading: false,
            disabled: false,
            onClick: () => modals = false,
            classNames: 'info',
            label: 'Cancel'
        }]">
            <span style="color:brown;">{{ errorMsg }}</span>
            <form @submit.prevent="submit" class="form">
                <div class="dates">
                    <input required type="datetime-local" v-model="form.startDate" name="start" id=""
                        placeholder="start">
                    <input required type="datetime-local" :min="form.startDate" v-model="form.endDate" name="end" id=""
                        placeholder="end">
                </div>
                <input required type="month" v-model="form.month" name="" id="">
            </form>
        </CommonModalsBody>
    </CommonModal>

</template>

<script setup lang="ts">
import { getPeriods, postPeriod } from '~/services/admin/period'
import type { periodReq, periodRes } from '~/types/admin/period'


const periods = ref<periodRes[] | null>(null)
const modals = ref(false)
const form = ref({
    startDate: "",
    endDate: "",
    month: ""
})
const errorMsg = ref("")
const sending = reactive({
    isSending: false,
    progress: 0,
    message: '',
    error: false
})

const submit = async () => {
    try {
        errorMsg.value = ""
        if (!form.value.startDate || !form.value.endDate || !form.value.month) {
            throw new Error('Missing data from form')
        }
        sending.error = false
        sending.isSending = true
        sending.progress = 20
        sending.message = "formatting data"
        const splitMonth = form.value.month.split('-')
        const newForm: periodReq = {
            startDate: form.value.startDate ?? '',
            endDate: form.value.endDate ?? '',
            month: splitMonth[1] ?? '',
            year: splitMonth[0] ?? '',
            active: true
        }
        sending.progress = 40
        sending.message = "Creating period"
        const res = await postPeriod(newForm)
        if (res) {
            sending.progress = 100
            sending.message = "Period Created"
        }
    }
    catch (error) {
        sending.error = true
        errorMsg.value = (error as Error).message
    }

}
const fetchPeriods = async () => {
    try {
        const res = await getPeriods()
        if (res) {
            periods.value = res.data
        }

    }
    catch (error) {

    }
}
const done = () => {
    modals.value = false
    fetchPeriods()
}

onMounted(() => {
    fetchPeriods()
})

definePageMeta({
    layout: 'admin-layout',
    middleware: 'admin'
})
</script>

<style scoped>
.page {
    display: flex;
    padding: 10%;
}

.periods {
    width: 80%;
    height: 600px;
    overflow-y: auto;
    /* border: 1px solid black; */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 20px;
}

.periods .item {
    width: 150px;
    height: 200px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 10px 10px;
}

.periods .item .image {
    /* width: inherit; */
    height: 80%;
    align-content: center;
    padding: 10px 20px;
}

.periods .item .image i {
    font-size: 100px;
}

.periods .item .detail {
    height: 20%;
    text-align: center;
}

.periods .active {
    background-color: rgb(138, 248, 136);
}

.periods .new {
    background-color: rgb(227, 226, 226);
    cursor: pointer;
}

.periods .new:hover {
    background-color: rgb(209, 208, 208);

}

.periods .new .image {
    font-size: 100px;
    color: rgba(0, 0, 0, 0.28)
}

.periods .new .image i {
    color: rgba(0, 0, 0, 0.28)
}

.periods .new .details {
    color: rgba(0, 0, 0, 0.28);
    font-weight: 500;
}

.form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.form input {
    padding: 10px;
    margin: 10px;
}

.form .dates {
    display: flex;
    flex-direction: row;
}
</style>