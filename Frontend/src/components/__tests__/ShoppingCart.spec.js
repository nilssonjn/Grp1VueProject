import { test, expect, beforeEach, describe, vi } from "vitest";
import ShoppingCart from "../ShoppingCart.vue";
import { mount } from '@vue/test-utils';





describe('ShoppingCart', () => {
    beforeEach(() => {
        // Mock fetch and ale
        global.fetch = vi.fn();
        global.alert = vi.fn();


        // Mock localStorage
        const localStorageMock = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        };


        // Set up mock data
        localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'books') {
                return JSON.stringify([{id: 1, title: 'Test Book'}]);
            }
            return null;
        });

    })


    test('should remove a book from the cart', async () => {
        // Arrange
        const book = {id: 1, title: 'Test Book'};
        localStorage.setItem('books', JSON.stringify([book]));
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Act
        await wrapper.find('.remove-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        // Assert
        expect(wrapper.vm.cartItems).toHaveLength(0);
        expect(JSON.parse(localStorage.getItem('books'))).toEqual([]);
    });

    test('should clear the cart after purchase', async () => {
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Mocka svar från fetch för att hämta boken
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                //json: () => Promise.resolve({ stock: 5 }),
            })
        );

        // Mocka svar för att uppdatera lagret
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
            })
        );
    });

    test('should update stock when books are purchased', async () => {
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Mocka getBookFromID för att returnera ett objekt med lager
        wrapper.vm.getBookFromID = vi.fn().mockImplementation(() =>
            Promise.resolve({id: 1, stock: 5, title: 'Test Book'})
        );

        // Mocka updateStockInDB för att alltid returnera ok
        wrapper.vm.updateStockInDB = vi.fn().mockImplementation(() =>
            Promise.resolve({ok: true})
        );

        await wrapper.find('.checkout-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(wrapper.vm.getBookFromID).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.updateStockInDB).toHaveBeenCalledTimes(1);
        expect(global.alert).toHaveBeenCalledWith('Books bought!');
    });

});



