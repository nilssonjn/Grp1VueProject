import { test, expect, beforeEach, describe, vi } from "vitest";
import ShoppingCart from "../ShoppingCart.vue";
import { mount } from '@vue/test-utils';


describe('ShoppingCart', () => {
    beforeEach(() => {
        // Mocka fetch
        global.fetch = vi.fn();
        global.alert = vi.fn();
    });

    test('should remove a book from the cart', async () => {
        // Arrange
        const book = { id: 1, title: 'Test Book' };
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
        // Arrange
        const book = { id: 1, title: 'Test Book' };
        localStorage.setItem('books', JSON.stringify([book]));
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Mocka svar från fetch för att hämta boken
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ stock: 5 }),
            })
        );

        // Mocka svar för att uppdatera lagret
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
            })
        );

        // Act
        await wrapper.find('.checkout-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        // Assert
        expect(wrapper.vm.cartItems).toHaveLength(0);
        expect(JSON.parse(localStorage.getItem('books'))).toEqual([]);
    });

    /*test('should clear the cart after purchase', async () => {
        // Arrange
        const book = { id: 1, title: 'Test Book' };
        localStorage.setItem('books', JSON.stringify([book]));
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Act
        await wrapper.find('.checkout-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        // Assert
        expect(wrapper.vm.cartItems).toHaveLength(0);
        expect(JSON.parse(localStorage.getItem('books'))).toEqual([]);


    });*/



    test('should update stock when books are purchased', async () => {
        // Arrange
        const book = { id: 1, title: 'Test Book' };
        localStorage.setItem('books', JSON.stringify([book]));
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Mocka svar från fetch för att hämta boken
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ stock: 5 }),
            })
        );

        // Mocka svar för att uppdatera lagret
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
            })
        );

        // Act
        await wrapper.find('.checkout-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        // Assert
        expect(fetch).toHaveBeenCalledTimes(2); // Kontrollera att fetch anropades två gånger
        expect(fetch).toHaveBeenCalledWith(`http://localhost:3001/api/books/${book.id}`);
        expect(fetch).toHaveBeenCalledWith(`http://localhost:3001/api/books/stock/${book.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stock: 4, // Lager ska ha minskat med 1
            }),
        });
        expect(wrapper.vm.cartItems).toHaveLength(0);
        expect(JSON.parse(localStorage.getItem('books'))).toEqual([]);
    });
});
