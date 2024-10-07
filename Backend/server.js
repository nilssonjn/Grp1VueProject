const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: './database.sqlite'
})
var db = {}


// THIS FUNCTION WILL CREATE DUMMY DATA IN DATABASE TABLE
async function setupDB() {
    try {
        db.Task = sequelize.define('Task', {
            text: {
                type: DataTypes.STRING,
                allowNull: false
            },
        });
        await sequelize.sync({ force: true });
        await db.Task.create({ text: "Item-1-MertKadirGursoy"});
        await db.Task.create({ text: "Item-2"});
        await db.Task.create({ text: "Item-3"});
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
        app.use(express.json())
        app.get('/', (req, res) => {
            res.send('hello world')
        })



        // GET METHOD API URL | RETRIEVE ITEMS
        app.get('/api/tasks', (req, res) => {
            // return all taskls
            db.Task.findAll().then(tasks => {
                res.json(tasks)
            })
        })
        // POST METHOD API URL | CREATE ITEM
        app.post('/api/tasks', (req, res) => {
            // create a task
            db.Task.create(req.body).then( t => {
                res.json(t)
            })
        })



        // DELETE METHOD API URL | DELETE ITEM
        app.delete('/api/tasks/:id', (req, res) => {
            // delete a task
            db.Task.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.sendStatus(204);
            }).catch((error) => {
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
