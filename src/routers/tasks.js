const express = require ('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require ('../middleware/auth')

router.get('/test-task', (req, res)=>{
    res.send('This is a testing')
})


router.post('/tasks', auth, async (req, res)=>{
    //const task = new Task(req.body)
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send(e)
    }

        
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})



//Reading a list of tasks
router.get('/tasks', auth, async (req, res)=>{
    const match = {}
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    try {
        //const task = await Task.find({owner: req.user._id})
        await req.user.populate({
            'path': 'tasks',
            match,
            options :{
                limit: parseInt(req.query.limit), //parseInt to convert a string to a integer
                skip: parseInt(req.query.skip),
                sort
                   //createdAt: -1 //acsending is 1, desc is -1
                  // completed: 1 //desc (true), acs (false)
                
            
            }
        
        }).execPopulate()
        res.status(202).send(req.user.tasks)
    }
    catch (e){
        res.status(500).send()
    }
    // Task.find({}).then((task)=>{
    //     res.status(202).send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

//Reading particular tasks

router.get('/tasks/:id', auth, async(req, res)=>{
    const _id=req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        res.status(202).send(task)
    } catch (e) {
        res.status(500).send(e)

    }
    // Task.findById(_id).then((task)=>{
    //     if(!task) {
    //         return res.status(404).send()
    //     }
    //     res.status(202).send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})




router.patch('/tasks/:id', auth, async(req, res)=> {
    const allowUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidated = updates.every((update)=> {
        return allowUpdates.includes(update)
    })
    if (!isValidated) {
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const _id = req.params.id
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(400).send (
                {error: 'Task not found'}
            )
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        //const task = await Task.findByIdAndUpdate(_id, req.body,  { new: true, runValidators: true})

        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.delete('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete ({_id, owner:req.user._id})
        if(!task) {
            return res.status(404).send({error: 'Task not Found'})
        }
        res.status(200).send(task)

    }catch (e){
        res.status(500).send(e)
    }
})

module.exports = router