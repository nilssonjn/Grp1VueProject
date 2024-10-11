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
            isbn: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            publishyear: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        });
        await sequelize.sync({force: true});

        /*// Define test books -------------------------- TEST REMOVE LATER
        const testBooks = [
            {
                title: "Test Book 1",
                author: "Author 1",
                summary: "Summary of Test Book 1",
                stock: 10,
                price: 100,
                image: "https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg"
            },
            {
                title: "Test Book 2",
                author: "Author 2",
                summary: "Summary of Test Book 2",
                stock: 20,
                price: 200,
                image: "https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg"
            },
            {
                title: "Test Book 3",
                author: "Author 3",
                summary: "Summary of Test Book 3",
                stock: 30,
                price: 300,
                image: "https://marketplace.canva.com/EAFPHUaBrFc/1/0/1003w/canva-black-and-white-modern-alone-story-book-cover-QHBKwQnsgzs.jpg"
            }
        ];

        // Insert test books into the database
        for (const book of testBooks) {
            await db.BookList.create(book);
        }*/

        // Fetch data from Google Books API
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=books&maxResults=40');
        if (!response.ok) {
            console.error("Failed to fetch books. Status:", response.status);
            return;
        }
        const data = await response.json();
        const books = data.items || [];

        // Insert fetched data into the database
        for (const item of books) {
            const book = item.volumeInfo;
            const selfLink = item.selfLink;

            // Fetch detailed information using selfLink
            const detailResponse = await fetch(selfLink);
            if (!detailResponse.ok) {
                console.error("Failed to fetch book details. Status:", detailResponse.status);
                continue;
            }

            const detailData = await detailResponse.json();
            const detailedBook = detailData.volumeInfo;

            await db.BookList.create({
                title: book.title,
                summary: book.description || "No description available.",
                price: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
                stock: Math.floor(Math.random() * 100) + 1, // Random stock value
                author: Array.isArray(detailedBook.authors) ? detailedBook.authors.join(', ') : 'Unknown author',

                image: book.imageLinks ? book.imageLinks.thumbnail : null,
                isbn: detailedBook.industryIdentifiers ? detailedBook.industryIdentifiers.map(id => id.identifier).join(', ') : 'Unknown ISBN',
                publishyear: detailedBook.publishedDate ? detailedBook.publishedDate.split('-')[0] : 'Unknown publish year'

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
