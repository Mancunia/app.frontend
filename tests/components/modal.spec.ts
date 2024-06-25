import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Modal from "~/components/common/modal.vue";

describe("Modal.vue", () => {
    it("renders modal with correct content", async () => {
        const id = "myModal";
        const size = "modal-lg";
        const wrapper = mount(Modal, {
            props: {
                id,
                size
            },
            slots: {
                default: "<p>Modal Content</p>"
            }
        });

        // Assert that the modal content is rendered
        expect(wrapper.find(".modal-content").text()).toContain(
            "Modal Content"
        );
    });

    it("renders modal with correct attributes", async () => {
        const id = "myModal";
        const size = "modal-lg";
        const wrapper = mount(Modal, {
            props: {
                id,
                size
            },
            slots: {
                default: "<p>Modal Content</p>"
            }
        });

        // Assert that the modal has the correct id
        expect(wrapper.attributes("id")).toBe(id);

        // Assert that the modal has the correct size class
        expect(wrapper.find(".modal-dialog").classes()).toContain(size);
    });

    it("renders modal with default size if size prop is not provided", async () => {
        const id = "myModal";
        const wrapper = mount(Modal, {
            props: {
                id
            },
            slots: {
                default: "<p>Modal Content</p>"
            }
        });

        // Assert that the modal has the default size class
        expect(wrapper.find(".modal-dialog").classes()).toContain(
            "modal-dialog-centered"
        );
    });
});
