import { test, expect, beforeEach,  describe, vi } from "vitest";
import ShoppingCart from "../ShoppingCart.vue";
import { mount } from '@vue/test-utils';





describe('ShoppingCart', () => {
    beforeEach(() => {
        // Mock fetch and ale
        global.fetch = vi.fn();
        global.alert = vi.fn();
    })


    // Mock localStorage
    const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    }


    test('should remove a book from the cart', async () => {
        // Arrange
        const book1 = {id: 1, title: 'Test Book 1'};
        const book2 = {id: 2, title: 'Test Book 2'}
        localStorageMock.setItem('books', JSON.stringify([book1, book2]));
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();


        // Act
        await wrapper.vm.removeBook(1);
        await wrapper.find('.remove-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        // Assert
        expect(wrapper.vm.cartItems).toHaveLength(1);
        expect(wrapper.vm.cartItems[0]).equal.to([book2])
        expect(JSON.parse(localStorageMock.getItem('books'))).toEqual([book2]);
    });

    test('should clear the cart after purchase and update stock', async () => {
        const book = {id: 1, title: 'Test Book', stock: 5};
        localStorageMock.setItem('books', JSON.stringify([book]))
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Mocka getBookFromID
        wrapper.vm.getBookFromID = vi.fn().mockResolvedValue({id: 1, title: 'Test Book', stock: 5,});

        // Mocka updateStockInDB
        wrapper.vm.updateStockInDB = vi.fn().mockResolvedValue({ok: true});


        await wrapper.find('.checkout-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(wrapper.vm.cartItems).toHaveLength(0); // Kontrollera att cartItems är tomt
        expect(JSON.parse(localStorage.getItem('books'))).toEqual([]);
    });

});













