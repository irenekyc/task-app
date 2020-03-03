// CRUD operations Create Read Update Delete

// const mongodb = require ('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID} = require ('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//create id for our database
// const id = new ObjectID()
// console.log(id.id.length)
// console.log(id.toHexString().length)

//error, client means success
MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client)=>{
    if (error) {
        return console.log(error)
    }
    const db = client.db(databaseName)
    ///////////////////////**************DELETE DB********************///////////////////////
    // db.collection('users').deleteMany({
    //     age: 20
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description: 'Task3'
    }).then((result)=>{
        console.log('You have successfully deleted!')
    }).catch((error)=>{
        console.log('An error occur!')
    })
    


    ///////////////////////***************UPDATE DB******************///////////////////////
    // db.collection('users').updateOne({
    //         _id: new ObjectID("5e56c425341afb36f2b40361")
    //     },{
    //         //$set: {
    //             //name: 'Jane',
    //             //age: 28
    //             //}
    //         $inc: {
    //             age: 1
        
    //         }
    //     }).then((result)=>
    //     {console.log(result)})
    //     .catch((error)=>{
    //         console.log(error)
    //     })

    // db.collection('tasks').updateMany({
    //     completed: true},
    //     { $set: {completed: false}}).then((result)=>{
    //     console.log('Successfully upated! Please check')
    // }).catch((error)=>{
    //     console.log('This is an error!', error)
    // })

////////////////////////******* INSERT DB*************************//////////////////////

    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Irene',
    //     age: 20
    // }, (error, result)=>{
    //     if(error) {
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([{'name': 'User2', 'age': 28}, {'name': 'User3', 'age': 25}], (error, result)=>{
    //     if(error) {
    //         return console.log('Unable to insert')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {'description': 'Task1', 'completed': true},
    //     {'description': 'Task2', 'completed': false},
    //     {'description': 'Task3', 'completed': true}], (error, result)=>{
    //         if (error) {
    //             return console.log('Unable to insert document')
    //         }
    //         console.log(result.ops)
    //     })

    ////////////////////*******************READ******************/////////////////////

    // db.collection('users').findOne({_id: new ObjectID("5e56c254f7a79136dc081bc6")}, (error, user)=>{
    //     if (error) {
    //         return console.log('Unable to find the user')
    //     }
    //     console.log(user)
    // })

    //for find multiple, you will receive a cursor and we have to convert it to array

    // db.collection('users').find({age: 20 }).toArray((error, user)=>{
    //     console.log(user)
    //     console.log(user[0])
    // })

    // db.collection('users').find({age: 20}).count((error, count)=>{
    //     console.log(count)
    // })

    // db.collection('tasks').find({completed: true}).toArray((error, tasks)=>{
    //     console.log(tasks[0].description)
    // })

})