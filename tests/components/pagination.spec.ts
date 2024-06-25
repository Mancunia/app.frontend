import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import Pagination from "~/components/common/pagination.vue";

vi.mock("#app", async () => {
    const actual = await vi.importActual("vue-router");
    return {
        ...actual,
        defineNuxtPlugin: vi.fn(),
        useRoute: vi.fn(() => ({
            query: {
                page: 1
            }
        })),
        useRouter: vi.fn(() => ({
            currentRoute: {
                value: {
                    query: {
                        page: 1
                    }
                }
            },
            push: vi.fn()
        }))
    };
});

describe("Pagination.vue", () => {
    it("renders pagination with correct page range", async () => {
        const wrapper = mount(Pagination, {
            props: {
                pageIndex: 1,
                totalPages: 10,
                totalRecords: 100
            }
        });

        // Check if pagination renders correctly
        expect(wrapper.findAll(".page-item .page-number").length).toBe(5);
    });

    it("pageRange should generate correct pages when middle pages are selected", async () => {
        const wrapper = mount(Pagination, {
            props: {
                pageIndex: 1,
                totalPages: 10,
                totalRecords: 100
            }
        });

        // Simulate click on page 3
        await wrapper.findAll("a.page-link.page-number")[3].trigger("click");

        // Wait for next tick to ensure computed properties are updated
        await wrapper.vm.$nextTick();

        // Check if router's push method was called with the updated query param
        expect((wrapper.vm as any).pageRange).toEqual([2, 3, 4, 5, 6]);
    });

    it("updates selected page when a page number is clicked", async () => {
        const wrapper = mount(Pagination, {
            props: {
                pageIndex: 1,
                totalPages: 10,
                totalRecords: 100
            }
        });

        // Simulate click on page 3
        await wrapper.findAll("a.page-link.page-number")[2].trigger("click");

        // Check if selectedPage updates correctly after click
        expect((wrapper.vm as any).selectedPage).toBe(3);
    });
});
