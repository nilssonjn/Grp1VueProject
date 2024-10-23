/*
import { test, expect, beforeEach, afterEach, describe, vi } from "vitest";
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
        const mockedLocalStorage = localStorageMock.getItem.mockImplementation((key) => {
            if (key === 'books') {
                return JSON.stringify([{id: 1, title: 'Test Book'}]);
            }
            return null;
        });


    })

    afterEach(() => {
        // Återställ mockar
        vi.clearAllMocks();
        delete window.location; // Ta bort moc

    });
    test('should remove a book from the cart', async () => {
        // Arrange
        const book1 = {id: 1, title: 'Test Book 1'};
        const book2 = {id: 2, title: 'Test Book 2'}
        localStorage.setItem('books', JSON.stringify([book1, book2]));
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Act
        await wrapper.find('.remove-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        // Assert
        expect(wrapper.vm.cartItems).toHaveLength(1);
        expect(wrapper.vm.cartItems[0]).equal.to([book2])
        expect(JSON.parse(localStorage.getItem('books'))).toEqual([book2]);
    });

    test('should clear the cart after purchase', async () => {
        const book = {id: 1, title: 'Test Book', stock: 5};
        localStorage.setItem('books', JSON.stringify([book]))
        const wrapper = mount(ShoppingCart);
        await wrapper.vm.$nextTick();

        // Mocka getBookFromID för att returnera en bok med lagervärde
        wrapper.vm.getBookFromID = vi.fn().mockResolvedValue({id: 1, title: 'Test Book', stock: 5,});

        // Mocka updateStockInDB för att alltid returnera ett lyckat svar
        wrapper.vm.updateStockInDB = vi.fn().mockResolvedValue({ok: true});


        await wrapper.find('.checkout-button').trigger('click');
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(wrapper.vm.cartItems).toHaveLength(0); // Kontrollera att cartItems är tomt
        expect(JSON.parse(localStorage.getItem('books'))).toEqual([]);
    });

})


test('should update stock when books are purchased', async () => {
    if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
        const originalReload = window.location.reload; // Spara original reload-funktionen
        window.location.reload = vi.fn(); // Mocka reload

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

        window.location.reload = originalReload;
    }
});
*/



