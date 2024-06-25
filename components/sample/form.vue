<template>
    <div>
        <form @submit.prevent="submitForm">
            <div class="card border-0 p-0">
                <div class="modal-body py-4">
                    <div class="">
                        <h6 class="font-weight-bolder mb-1">Add Teacher</h6>
                        <p class="mb-0 text-muted">Add teacher's information</p>
                    </div>
                    <form action="" class="pt-4">
                        <div class="mb-4">
                            <label for="mobile" class="form-label"
                                >Mobile Number
                                <span class="text-danger">*</span></label
                            >
                            <div class="input-group mb-0">
                                <span
                                    id="basic-addon1"
                                    class="input-group-text rounded-right-0 border-end-0 bg-white"
                                    >+233</span
                                ><input
                                    v-model="form.data.number"
                                    type="text"
                                    class="form-control rounded-left-0 border-start-0"
                                    placeholder="Enter teacher's mobile number"
                                />
                            </div>
                        </div>
                        <div class="mb-4">
                            <label for="email" class="form-label">Email</label
                            ><input
                                v-model="form.data.email"
                                type="email"
                                class="form-control"
                                placeholder="Enter teacher's email address"
                            />
                        </div>

                        <div class="mb-4">
                            <div
                                class="form-check form-switch d-flex align-items-center p-0 mb-4 mt-3"
                            >
                                <label
                                    class="form-check-label h6 mb-0"
                                    for="flexSwitchCheckDefault"
                                    >Can send messages </label
                                ><input
                                    id="flexSwitchCheckDefault"
                                    v-model="form.data.canSendMessages"
                                    class="form-check-input big ms-3"
                                    type="checkbox"
                                />
                            </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2 pt-5">
                            <a
                                class="btn btn-outline-primary"
                                @click="closeModal"
                                >Cancel</a
                            ><a class="btn btn-primary" @click="submitForm"
                                >Submit</a
                            >
                        </div>
                    </form>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
const { addError } = useToast();
const form = reactive<{
    data: { number: string; email: string; canSendMessages: boolean };
    loading: boolean;
}>({
    data: {
        number: "",
        email: "",
        canSendMessages: false
    },
    loading: false
});

const closeModal = () => {
    dismissModal("test");
};

const submitForm = () => {
    // Implement form submission logic here
    try {
        setTimeout(() => {
            form.loading = true;
            setTimeout(() => {
                form.loading = false;
                closeModal();
            }, 2000);
        }, 1000);
    } catch (error: any) {
        addError(error?.data?.messages);
    }
};
</script>
