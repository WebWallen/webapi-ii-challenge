const express = require('express');

const postsRouter = require('./posts/posts-router.js');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.send(`
        <h1>Did It Work?</h1>
        <p>Indeed, it did!</p>
    `)
});

const port = 5000;

server.listen(port, () => {
    console.log(`\n Server listening on port ${port}`)
})