<template>
    <div class="page">
        <div class="content">
            <div class="list">
                <UiAdminInputField place-holder="search" type="text" @update:model-value="search = $event" />
                <div class="users">
                    <UiAdminProfileItem v-for="user in users" :key="user.id" :profile="user"
                        @click="selectedUser = user" />
                </div>
            </div>
            <div class="profile">
                <UiAdminProfile v-if="selectedUser" :profile="selectedUser" />
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { USER_PROFILE } from '~/types/auth';
import { getUserProfiles } from '~/services/admin/users';

const props = defineProps({
    userType: {
        type: Number as PropType<USER_ROLES>,
        required: true,
        default: 0
    }
})
const loading = ref(false);
const users = ref<USER_PROFILE[]>([]);
const selectedUser = ref<USER_PROFILE | null>(null);
const search = ref('');

const { debounce } = useUtils()


const fetchUsers = async () => {
    try {
        loading.value = true;
        const response = await getUserProfiles({ account: props.userType, search: search.value });
        users.value = response.data;
    }
    catch (error) {
        console.log(error);
    }
    finally {
        loading.value = false;
    }
}

watch(search, debounce(fetchUsers, 500));


onMounted(() => {
    fetchUsers();
})

</script>

<style scoped>
.page {
    padding: 20px;
}

.content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
    width: inherit;
    height: 90vh;
}

.list {
    width: 40%;
    height: 100%;
    background-color: rgb(212, 212, 212);
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
}

.list .users {
    display: flex;
    flex-direction: column;
    height: 80%;
    overflow-y: auto;
    padding: 20px;
}

.profile {
    width: 50%;
    height: 100%;
    border: 1px solid #ccc;
    padding: 20px;
}
</style>