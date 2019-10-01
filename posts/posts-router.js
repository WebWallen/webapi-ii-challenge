const express = require('express')
const Posts = require('../data/db.js');
const router = express.Router();

router.get('/', (req, res) => {
    Posts.find(req.body)
    .then(post => {
        res.status(201).json(post);
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error retrieving the posts',
        });
    });
});

router.post('/', (req, res) => {
    Posts.insert(req.body)
        .then(post => {
            if (!req.body.title || !req.body.contents) {
                res.status(400).json({
                    message: 'No title or contents.'
                })
            } else {
                res.status(201).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Error saving to database.'
            })
        })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id) 
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found'})
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error retrieving the post'
        });
    })
});

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id).then(comments => {
        if (req.params.id) {
            res.status(200).json(comments)
        } else {
            res.status(404).json({ message: 'Post not found'})
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Comments could not be retrieved'
        })
    })
})

router.post('/:id/comments', (req, res) => {
    const commentData = {...req.body, post_id: req.params.id };

    Posts.findById(req.params.id) 
        .then(post => {
            if (!post) {
                res.status(404).json({
                    message: 'That post does not exist'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Comment could not be saved'
            })
        })
    
        if (!req.body.text) {
            res.status(400).json({
                message: 'You did not type a comment, silly'
            }) 
        } else {
                Posts.insertComment(commentData)
                .then(comment => {
                    res.status(201).json(commentData)
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Comment could not be saved'
                    })
                });
            }
})

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(post => {
        if (!post) {
            res.status(404).json({ 
                message: 'Post does not exist'
            })
        } else {
            res.status(200).json({
                message: 'Post removed'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error removing post'
        })
    })
})

router.put('/:id', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({
            message: 'Provide a title and content'
        })
    } else {
        Posts.update(req.params.id, req.body) 
        .then(post => {
            if (post) {
                res.status(200).json({
                    ...req.body.id,
                    id: req.params.id
                })
            } else {
                res.status(404).json({
                    message: 'Post does not exist'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Post could not be edited'
            })
        })
    }
})

module.exports = router; // don't forget to export or nothing works