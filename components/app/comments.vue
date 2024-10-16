<template>
    <div>
        <div class="comment-list">


        </div>
        <div class="comment">
            <form @submit.prevent="">
                <div class="input-box">

                    <input type="text" v-model="comment.comment" name="comment" id="comment"
                        :placeholder="comment.placeholder" control-id="ControlID-3">
                    <button type="submit">send</button>
                </div>
            </form>

        </div>
    </div>

</template>

<script setup lang="ts">
const props = defineProps({
    id: {
        type: String,
        required: true
    }
})
const emit = defineEmits(['newComments'])
const placeholders = ['nice book....', 'write something...', 'your thoughts...', 'say something...', 'share your opinion...', 'leave a comment...', 'what do you think?', 'express yourself...',
    'give your feedback...',
    'let us know...',
    'drop a comment...',
    'share your thoughts...',
    'what are your views?',
    'comment here...',
    'join the discussion...',
    'voice your opinion...',
    'tell us what you think...',
    'add your comment...'
];

const comment = ref<{ comment: string | null, placeholder: string }>({ comment: null, placeholder: placeholders[0] });

const shufflePlaceholder = () => {

    comment.value.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
};

onMounted(() => {
    const interval = setInterval(() => {
        shufflePlaceholder();
    }, 3000);

    onBeforeUnmount(() => {
        clearInterval(interval);
    });
});

</script>

<style scoped>
.comment-list {
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.input-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    min-width: 300px;
    max-width: 400px;
    height: auto;
    border-radius: 10px;
    border: 2px solid #503519;
}

.input-box input {
    width: 100%;
    border: none;
    outline: none;
    background: none;
    font-size: 14px;
}

.input-box button {
    background: #503519;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>