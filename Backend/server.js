const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
})
var db = {}

async function setupDB() {
    try {
        db.BookList = sequelize.define('BookList', {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            author: {
                type: DataTypes.STRING,
                allowNull: false
            },
            summary: {
                type: DataTypes.STRING,
                allowNull: false
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 50
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            },
        });
        await sequelize.sync({force: true});

        // Define test books -------------------------- TEST REMOVE LATER
        const testBooks = [
            {
                title: "Test Book 1",
                author: "Author 1",
                summary: "Summary of Test Book 1",
                stock: 10,
                price: 100,
                image: "https://example.com/image1.jpg"
            },
            {
                title: "Test Book 2",
                author: "Author 2",
                summary: "Summary of Test Book 2",
                stock: 20,
                price: 200,
                image: "https://example.com/image2.jpg"
            },
            {
                title: "Test Book 3",
                author: "Author 3",
                summary: "Summary of Test Book 3",
                stock: 30,
                price: 300,
                image: "https://example.com/image3.jpg"
            }
        ];

        // Insert test books into the database
        for (const book of testBooks) {
            await db.BookList.create(book);
        }

        // Fetch data from Open Library API
        const response = await fetch('https://openlibrary.org/search.json?q=books&limit=50');
        if (!response.ok) {
            console.error("Failed to fetch books. Status:", response.status);
            return;
        }
        const data = await response.json();
        const books = data.docs || [];

        // Insert fetched data into the database
        for (const book of books) {
            await db.BookList.create({
                title: book.title,
                summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                price: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
                stock: book.stock,
                author: book.author_name ? book.author_name.join(', ') : 'Unknown author',
                image: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            });
        }
    } catch (error) {
        console.error(error);
    }
}

// CREATE APIs URL ENDPOINTS TO CREATE AND DELETE TO DO ITEMS
async function startServer() {
    try {
        await setupDB()
        const port = 3001
        const express = require('express')
        const app = express()
        const cors = require('cors');
        app.use(cors());
        app.use(express.json())
        app.get('/', (req, res) => {
            res.send('hello world')
        })

        // GET METHOD API URL | RETRIEVE ITEMS
        app.get('/api/books', (req, res) => {
            // return all books
            db.BookList.findAll().then(tasks => {
                res.json(tasks)
            })
        })

        // PUT METHOD API URL | UPDATE STOCK
        app.put('/api/books/stock/:id', (req, res) => {
            // Extract the new stock value from the request body
            const {stock} = req.body;

            // Update the stock for the book with the given id
            db.BookList.update(
                {stock: stock}, // Specify the new stock value
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
                .then(() => {
                    res.sendStatus(200); // Respond with success status
                })
                .catch((error) => {
                    console.error(error);
                    res.sendStatus(500);
                });
        });

        app.get('/api/books/:id', (req, res) => {
            db.BookList.findByPk(req.params.id)
                .then(book => {
                    if (book) {
                        res.json(book);

                    } else {
                        res.sendStatus(404); // Not Found
                    }
                })
                .catch(error => {
                    console.error(error);
                    res.sendStatus(500); // Internal Server Error
                });
        });


        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
    } catch (error) {
        console.error(error);
    }
}

startServer()
