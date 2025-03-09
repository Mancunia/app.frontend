<template>
    <div class="page">
        <div class="content">
            <div class="list">
                <UiAdminInputField place-holder="search" type="text" @update:model-value="search = $event" />
                <div class="users">
                    <UiAdminProfileItem v-for="user in users" :key="user.id" :profile="user"
                        @click="selectedUser = user" :active="selectedUser?.id == user.id" />
                </div>
            </div>
            <div class="profile">

                <UiAdminProfile v-if="selectedUser" :profile="selectedUser" />
                <div v-else class="placeHolder">
                    <img src="@/assets/images/profilePlaceHolder.png" alt="">
                </div>

                <div v-if="selectedUser" class="actions">
                    <UiAdminButton v-if="selectedUser.account != USER_ROLES.ASSOCIATE" :loading="loading.makeAssociate"
                        @click="makeAssociate">
                        Make Associate
                    </UiAdminButton>
                    <UiAdminButton v-if="selectedUser.account != USER_ROLES.ADMIN" :loading="loading.makeAdmin"
                        :style="`background-color: black`" @click="makeAdmin">
                        Make Admin
                    </UiAdminButton>
                    <UiAdminButton v-if="selectedUser.account != USER_ROLES.USER" :loading="loading.makeUser"
                        :style="`background-color: green`" @click="makeUser">
                        Make User
                    </UiAdminButton>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { USER_PROFILE } from '~/types/auth';
import { getUserProfiles, changeRole } from '~/services/admin/users';

const props = defineProps({
    userType: {
        type: Object as PropType<USER_ROLES | USER_ROLES[]>,
        required: true,
        default: null
    },
})
const loading = ref<{ base: boolean, makeAssociate: boolean, makeAdmin: boolean, makeUser: boolean }>({ base: false, makeAssociate: false, makeAdmin: false, makeUser: false });
const users = ref<USER_PROFILE[]>([]);
const selectedUser = ref<USER_PROFILE | null>(null);
const search = ref('');

const { debounce } = useUtils()
const { addSuccess,addError } = useToast();


const fetchUsers = async () => {
    try {
        loading.value.base = true;
        const response = await getUserProfiles({ account: props.userType, search: search.value });
        if (response) {
            users.value = response.data;
        }
    }
    finally {
        loading.value.base = false;
    }
}

const changeUserRole = async (type: USER_ROLES) => {
    try {
        if (!selectedUser.value) return;
        loading.value.makeAssociate = true;
        const response = await changeRole({ userId: selectedUser.value.id, type });
        if (response) {
            addSuccess('User role has been updated');
            selectedUser.value.account = response.data.account;
            fetchUsers();
        }
    }
    finally {
        loading.value.makeAssociate = false;
    }
}
const makeUser = () => {
    try {
        loading.value.makeUser = true;
        loading.value.makeAssociate = true;
        changeUserRole(USER_ROLES.USER);
    }
    catch (error:unknown) {
        if(error instanceof Error){
            addError(error.message)
        }
    }
    finally {
        loading.value.makeUser = false;
    }
}
const makeAdmin = () => {
    try {
        loading.value.makeAdmin = true;
        changeUserRole(USER_ROLES.ADMIN);
    }
    catch (error:unknown) {
        if (error instanceof Error) {
            addError(error.message)
        }
    }
    finally {
        loading.value.makeAdmin = false;
    }
}

const makeAssociate = () => {
    try {
        loading.value.makeAssociate = true;
        changeUserRole(USER_ROLES.ASSOCIATE);
    }
    catch (error:unknown) {
        if (error instanceof Error) {
            addError(error.message)
        }
    }
    finally {
        loading.value.makeAssociate = false;
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
    background-color: rgb(237 237 237);
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

.profile .placeHolder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.profile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
