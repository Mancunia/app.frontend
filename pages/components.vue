<template>
    <div class="px-4 py-4">
        <div class="d-flex" style="gap: 20px">
            <!-- Open Modal Usage -->
            <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                @click="displayModal"
            >
                Modal
            </button>

            <!-- Toast: Add Error and Success Toast -->
            <button type="button" class="btn btn-primary" @click="showError()">
                Add Error
            </button>
            <button
                type="button"
                class="btn btn-primary"
                @click="showSuccess()"
            >
                Add Success
            </button>

            <!-- Format Currency -->
            <button type="button" class="btn btn-clear">
                Currency: {{ formatCurrency(100) }}
            </button>

            <!-- Format Date -->
            <button type="button" class="btn btn-clear">
                Date: {{ formatDate(new Date().toDateString()) }}
            </button>
        </div>

        <div>
            <!-- Pagination Component -->
            <CommonPagination
                :page-index="1"
                :total-pages="10"
                :total-records="100"
                @on-page-change="goto($event)"
            />
        </div>

        <!-- Modal Component -->
        <CommonModal id="test">
            <div
                class="progress modal-progress position-absolute w-100"
                style="top: 0px"
            >
                <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style="width: 100%"
                />
            </div>
            <button
                type="button"
                class="close"
                data-bs-dismiss="modal"
                aria-label="Close"
            >
                <i class="fas fa-times" />
            </button>
            <div class="modal-body">
                <SampleForm />
            </div>
        </CommonModal>

        <CommonInfiniteScroll
            :options="{ root: null, rootMargin: '0px', threshold: 1.0 }"
            @intersect="loadMore"
        />
    </div>
</template>

<script setup lang="ts">
const { addError, addSuccess } = useToast();
const displayModal = () => {
    showModal("test", { backdrop: "static" });
};

const goto = (page: number) => {
    addSuccess("Navigating to page " + page);
    // Make api call to get records for the selected page
};

const showError = () => {
    addError("An error occurred");
};

const showSuccess = () => {
    addSuccess("Successfully added record");
};

const loadMore = () => {
    // Make api call to get more records
};
</script>
