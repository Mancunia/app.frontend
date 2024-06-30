<template>
    <div class="background">
        <section class="card align-center">
            <form @submit.prevent="login">
                <h2>Login</h2>
                <div class="input">
                    <input type="text" required placeholder="Username" v-model="form.email" />
                </div>
                <div class="input">
                    <input type="password" required placeholder="Password" v-model="form.password" />
                </div>
                <UiAdminButton>
                    <UiLoader v-if="loading" />
                    Login
                </UiAdminButton>
            </form>
        </section>
    </div>
</template>

<script setup lang="ts">
const form = ref({
    email: '',
    password: ''
});

const {admin_login,loading}=useAuth();

const login = async () => {
    await admin_login(form.value);
};

</script>

<style scoped>
.background {
    background-image: url('~/assets/images/bookShelve.png');
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    margin: 20px;
}
form{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;

}

.align-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.input {
    display: flex;
    padding:12px;
    flex-direction: row;
    width: 100%;
}

.input input{
    width: inherit;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>