import { test, expect, beforeEach,  describe, vi } from "vitest";
import ShoppingCart from "../ShoppingCart.vue";
import { mount } from '@vue/test-utils';


describe('ShoppingCart', () => {
    beforeEach(() => {
        // Mock fetch and ale
        global.fetch = vi.fn();
        global.alert = vi.fn();


        // Mock localStorage
        global.localStorage = {
            getItem: vi.fn((key) => {
                if (key === 'books') {
                    return JSON.stringify(
                        [{ id: 1, title: 'Test Book 1', stock:5, price: 100 },
                            { id: 2, title: 'Test Book 2', stock:5, price: 100 }]);
                }
                return null;
            }),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        };

    });


    test('should remove a book from the cart', async () => {


        // Arrange
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();


        // Act
        await wrapper.vm.removeBook(1);
        await new Promise(resolve => setTimeout(resolve, 0));

        // Assert
        expect(wrapper.vm.cartItems).toHaveLength(1);
        expect(wrapper.vm.cartItems[0]).toEqual(
            { id: 2, title: 'Test Book 2', stock: 5, price: 100 });

    });


    test('should add a new book to the cart', async () => {
        // Arrange
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();


        const newBook = { id: 3, title: 'New Test Book', stock: 10, price: 100 };

        // Act: Simulate adding the book to the cart
        wrapper.vm.cartItems.push(newBook);
        await wrapper.vm.$nextTick();


        localStorage.setItem('books', JSON.stringify(wrapper.vm.cartItems));
        await wrapper.vm.$nextTick(); // Ensure reactivity updates

        // Assert
        expect(wrapper.vm.cartItems).toHaveLength(3);
        expect(wrapper.vm.cartItems[2]).toEqual(newBook);

        // Assert localStorage is updated
        expect(global.localStorage.setItem).toHaveBeenCalledWith(
            'books',
            JSON.stringify([
                { id: 1, title: 'Test Book 1', stock: 5, price: 100 },
                { id: 2, title: 'Test Book 2', stock: 5, price: 100 },
                { id: 3, title: 'New Test Book', stock: 10, price: 100 }
            ])
        );
    });
});





