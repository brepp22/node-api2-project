// implement your posts router here
 const express = require('express')

 const Posts = require('./posts-model')

 const router = express.Router()

 router.get('/' , (req , res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        res.status(500).json({
            message: "The posts information could not be retrieved"
        })
    })
 })

 router.get('/:id' , (req , res) => {
   const { id } = req.params
   Posts.findById(id)
   .then(posts => {
    if(posts){
    res.status(200).json(posts)
    } else {
    res.status(404).json({message: "The post with the specified ID does not exist" })
    }
   })
   .catch(error => {
    res.status(500).json({
        message: "The post information could not be retrieved"
    })
   })
 })

 router.post('/' ,  (req, res) => {
    const post = req.body
    if (!post.title || !post.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Posts.insert(post)
            .then(({id}) => {
                return Posts.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
    .catch(error => {
        res.status(500).json({
            message: "There was an error while saving the post to the database"
        })
        })
    }
 })

 router.put('/:id', (req , res) => {
    const { title , contents } = req.body
    if (!title || !contents){
        res.status(400).json({message: "Please provide title and contents for the post" })
    } else {
        Posts.findById(req.params.id)
        .then(id => {
            if(!id){
                res.status(404).json({message: "The post with the specified ID does not exist" })
            } else {
                return Posts.update(req.params.id , req.body)
            }
        })
        .then(data => {
            if(data){
            return Posts.findById(req.params.id)
        }
    })
        .then (post => {
            res.status(200).json(post)
        })
        .catch(error => {
            res.status(500).json({message: "The post information could not be modified" })
        })
    }

 })

 router.delete('/:id', async (req, res) => {
   try {
    const isId = await Posts.findById(req.params.id)
    if(!isId){
        res.status(404).json({message: "The post with the specified ID does not exist"})
   } else {
    await Posts.remove(req.params.id)
    res.status(200).json(isId)
   }
    } catch(error) {
        res.status(500).json({message: "The post could not be removed" })
 }
})

router.get('/:id/comments' , async (req , res) => {
  try {
    const post = await Posts.findById(req.params.id)
    if(!post){
        res.status(404).json({message: "The post with the specified ID does not exist" })
    } else {
      const comment = await Posts.findPostComments(req.params.id)
      res.status(200).json(comment)  
    }
  }
  catch {
    res.status(500).json({message: "The comments information could not be retrieved" })
  }
})


 module.exports = router