<template>
    <div class="book-card-large-new">
        <img src="@/assets/images/book.jpeg" class="book-image">
        <div class="book-details-large">

            <UiAdminInputField class="inputs" placeholder="Enter Title" />
            <UiAdminInputField placeholder="Enter Title" />

            <div class="input-container-btn">
                <button class="drop-down-box-btn">
                    ENGLISH
                    <span><img class="polygon" src="@/assets/images/Polygon one.png" alt="" srcset=""></span>
                </button>
                <UiSelectDropDown :data-list="[{ id: '1', name: 'Item' }, { id: '2', name: 'Item1' }, { id: '3', name: 'name' }, { id: '4', name: 'name' }, { id: '5', name: 'name' }, { id: '6', name: 'name' }]" placeholder="languages" />
                <button class="drop-down-box-btn">

                    <div class="cat-chip">
                        <img class="polygon" src="@/assets/images/Group 37.png" alt="" srcset="">
                        hello
                    </div>
                    <div class="cat-chip">
                        <img class="polygon" src="@/assets/images/Group 37.png" alt="" srcset="">
                        hello
                    </div>
                    <div class="cat-chip">
                        <img class="polygon" src="@/assets/images/Group 37.png" alt="" srcset="">
                        hello
                    </div>
                    <span><img class="polygon" src="@/assets/images/Polygon one.png" alt="" srcset=""></span>
                </button>
            </div>

        </div>

    </div>
    <div class="save-btn">
        <button class="btn" @click="emit('submit')">SAVE</button>
    </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['submit'])
</script>