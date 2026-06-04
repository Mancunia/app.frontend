<template>
    <div class="mt-4">
        <nav
            v-if="props?.totalRecords > 0"
            aria-label="Page navigation"
        >
            <ul class="pagination justify-content-center">
                <li class="page-item">
                    <a
                        class="page-link pointer"
                        aria-label="First"
                        @click.prevent="handleFirst()"
                    >
                        <span aria-hidden="true">
                            <i class="bx bx-chevrons-left" />
                        </span>
                    </a>
                </li>

                <li class="page-item">
                    <a
                        class="page-link pointer"
                        aria-label="Previous"
                        @click.prevent="handlePrev()"
                    >
                        <span aria-hidden="true">
                            <i class="bx bx-chevron-left" />
                        </span>
                    </a>
                </li>

                <li v-for="n in pageRange" :key="n" class="page-item">
                    <a
                        href="#"
                        class="page-link page-number"
                        :class="{ active: selectedPage == n }"
                        @click.prevent="handleSelect(n)"
                    >
                        {{ n }}
                    </a>
                </li>
                <li class="page-item">
                    <a
                        href="#"
                        class="page-link"
                        aria-label="Next"
                        @click.prevent="handleNext()"
                    >
                        <span aria-hidden="true">
                            <i class="bx bx-chevron-right" />
                        </span>
                    </a>
                </li>

                <li class="page-item">
                    <a
                        href="#"
                        class="page-link"
                        aria-label="Last"
                        @click.prevent="handleLast()"
                    >
                        <span aria-hidden="true">
                            <i class="bx bx-chevrons-right" />
                        </span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    pageIndex: {
        type: Number,
        required: true,
        default: 1
    },
    forwardIcon: {
        type: String,
        required: false,
        default: null
    },
    totalPages: {
        type: Number,
        required: true
    },
    totalRecords: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(["onPageChange"]);
const route = useRoute();
const selectedPage = ref();
selectedPage.value = route.query.page
    ? parseInt(route.query.page as string)
    : 1;

// methods
const handleNext = () => {
    if (selectedPage.value + 1 <= props.totalPages) selectedPage.value += 1;
};

const handlePrev = () => {
    if (selectedPage.value > 1) selectedPage.value -= 1;
};

const handleFirst = () => {
    selectedPage.value = 1;
};

const handleLast = () => {
    selectedPage.value = props.totalPages;
};

const handleSelect = (value: any) => {
    selectedPage.value = value;
};

watch(
    selectedPage,
    (val: number) => {
        const router = useRouter();
        router.push({
            query: {
                ...router.currentRoute.value.query,
                page: selectedPage.value
            }
        });
        emit("onPageChange", val);
    },
    { immediate: true }
);

function generateNumberArray(
    totalPages: number,
    selectedPage: number,
    maximumArrayLength: number
) {
    const halfArrayLength = Math.floor(maximumArrayLength / 2);
    let start = Math.max(1, selectedPage - halfArrayLength);
    let end = start + maximumArrayLength - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maximumArrayLength + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const pageRange = computed(() => {
    return generateNumberArray(props.totalPages, selectedPage.value, 5);
});
</script>

<style scoped>
.pagination {
    display: flex;
    list-style: none;
    padding: 0;
    gap: 8px;
    align-items: center;
}
.page-item {
    display: flex;
}
.page-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--hairline);
    background: var(--card);
    color: var(--ink);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: 13px;
    transition: all 0.2s;
    cursor: pointer;
}
.page-link:hover {
    background: var(--hairline);
    border-color: var(--muted);
}
.page-link.active {
    background: var(--ochre);
    border-color: var(--ochre);
    color: white;
    font-weight: 600;
}
.page-link.pointer {
    font-size: 18px;
}
.page-number {
    font-family: var(--font-mono);
}
</style>
