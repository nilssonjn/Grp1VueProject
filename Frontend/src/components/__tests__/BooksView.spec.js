import { test, expect } from "vitest";
import { server } from "../__mocks__/server";
import { mount } from "@vue/test-utils";
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const restHandlers =[
    rest.get('http://localhost:3001/category/:name', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([
            {
                category: 'Fantasy'

            }
        ]))
    })
]

const server = setupServer(...restHandlers)

beforeAll(() => server.listen({onUnhandledRequest: 'error'}))

afterAll(() => server.close())

afterEach(() => server.reset())

test ("test API return category", async ()  => {
    const wrapper = mount(BooksView, {
        props: {
            name: 'Fantasy',
            limit: 10
        }
    });
await wrapper.vm.$nextTick();
expect(wrapper.vm.books[0].category).toBe('Fantasy');
});



