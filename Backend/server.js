const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
})
var db = {}

// get horror books
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
            category: {
                type: DataTypes.STRING,
                allowNull: true
            },

            publishyear: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        });
        await sequelize.sync({force: true});


        // Fetch data from Google Books API for fantasy books
        const fantasyResponse = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:fantasy');
        if (!fantasyResponse.ok) {
            console.error("Failed to fetch fantasy books. Status:", fantasyResponse.status);
            return;
        }
        const fantasyData = await fantasyResponse.json();
        const fantasyBooks = fantasyData.items || [];

        // Insert fetched fantasy books into the database
        for (const item of fantasyBooks) {
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
                publishyear: detailedBook.publishedDate ? detailedBook.publishedDate.split('-')[0] : 'Unknown publish year',
                category: "fantasy",
            });
        }
        // Fetch data from Google Books API for horror books
        const horrorResponse = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:horror');
        if (!horrorResponse.ok) {
            console.error("Failed to fetch horror books. Status:", horrorResponse.status);
            return;
        }
        const horrorData = await horrorResponse.json();
        const horrorBooks = horrorData.items || [];

        // Insert fetched horror books into the database
        for (const item of horrorBooks) {
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
                publishyear: detailedBook.publishedDate ? detailedBook.publishedDate.split('-')[0] : 'Unknown publish year',
                category: "horror",
            });
        }

        // Fetch data from Google Books API for sci-fi books
        const sciFiResponse = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:science%20fiction');
        if (!sciFiResponse.ok) {
            console.error("Failed to fetch sci-fi books. Status:", sciFiResponse.status);
            return;
        }
        const sciFiData = await sciFiResponse.json();
        const sciFiBooks = sciFiData.items || [];

        // Insert fetched sci-fi books into the database
        for (const item of sciFiBooks) {
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
                publishyear: detailedBook.publishedDate ? detailedBook.publishedDate.split('-')[0] : 'Unknown publish year',
                category: "sci-fi",
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

        // GET METHOD API URL | Get all books with year > 2000
        app.get('/api/newbooks', (req, res) => {
            db.BookList.findAll({
                where: {
                    publishyear: {
                        [Sequelize.Op.gt]: 2000
                    }
                }
            }).then(books => {
                res.json(books);
            }).catch(error => {
                console.error(error);
                res.sendStatus(500); // Internal Server Error
            });
        });

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
