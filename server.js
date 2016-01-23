var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;


// model

/*var todos = [{
id: '1',
description: 'Meet for lunch',
completed: false
}, {
id: '2',
description: 'Go to market',
completed: false
}, {
id: '3',
description: 'DOTO @ 10pm',
completed: true
}];*/

var todos = []
var todoNextId = 1;
var userId = 1;

app.use(bodyParser.json());

app.get('/',function (req, res){
  res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
  var query = req.query;
  var where = {};


  if (query.hasOwnProperty('completed') && query.completed == 'true'){
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed == 'false'){
    where.completed = false
  }

  if(query.hasOwnProperty('q') && query.q.length > 0){
    where.description = {
      $like:'%' + query.q +'%'
    }
  }

  db.todo.findAll( {where: where} ).then(function(todos){
    /*filteredTodos = [];
    todos.forEach(function(todo){
    filteredTodos.push(todo.toJSON());
  });*/
  res.json(todos);
}, function(e) {
  res.status(500).send();
});
/*
var filteredTodos = todos;

// if has property && completed is true
// filtertodo _.where
if (queryParams.hasOwnProperty('completed') && queryParams.completed == 'true'){
filteredTodos = _.where(filteredTodos, {completed: true});
} else if (queryParams.hasOwnProperty('completed') && queryParams.completed == 'false'){
filteredTodos = _.where(filteredTodos, {completed: false});
}

if(queryParams.hasOwnProperty('q')){
filteredTodos = _.filter(filteredTodos, function(todo){
return todo.description.indexOf(queryParams.q) > -1;
})
}
res.json(filteredTodos);*/

});

// GET /todos/:id variable to pass in
app.get('/todos/:id', function(req, res){app
  var todoId = req.params.id;

  //  var matchedTodo = _.findWhere(todos, {id: todoId});
  // console.log(matchedTodo);
  //  var matchingTodo = undefined;
  //  console.log(typeof todoId + ': ' + todoId);
  //  todos.forEach(function(todo){
  //  console.log(typeof todo.id + ': ' + todo.id);
  //      if(todo.id === todoId){
  //        console.log(matchingTodo);
  //      }
  //  });

  // if(typeof matchedTodo === 'undefined'){
  //   res.status(404).send();
  // }
  // else {
  //   res.json(matchedTodo);
  // }
  //res.send('Asking for todo with id of ' + req.params.id);

  db.todo.findById(todoId).then(function(todo){
    if(!!todo){
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    }
  }, function (e) {
    res.status(500).send();
  });

});

// POST /todos can take data
app.post('/todos', function(req, res){
  var body = _.pick(req.body, 'description', 'completed'); // use _.pick

  // call create on db.todo
  //  respond with 200 and todo
  //  e res.status(400).json(e)

  body.description = body.description.trim();
  body.id = todoNextId.toString();

  db.todo.create(req.body).then(function(todo){
    res.json(todo);
    todoNextId++;
  }).catch(function(e){
    res.status(400).json(e);
  });

  /*
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  return res.status(400).send();
}

body.description = body.description.trim();
// set body.description to be trimmed value

console.log('description: ' + body.description);
body.id = todoNextId.toString();
todoNextId++;
todos.push(body);
console.log(body);
res.json(body);
*/
});

// DELETE /todos/:id

app.delete('/todos/:id',function(req, res){
  var todoId = req.params.id;

  db.todo.destroy({
    where: {
      id: todoId //this will be your id that you want to delete
    }
  }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
    if(rowDeleted === 0){
      res.status(404).json({
        error: 'No todo with id'
      })
    } else {
      res.status(204).send() // nth to send back
    }
  }, function(){
    res.status(500).send();
  });
  //  todos = _.reject(todos,function(todo){
  //    return todo.id === todoId;
  //  });


  /*
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if(!matchedTodo) {
  res.status(404).json({"error": "no todo found with that id"});
} else {
todos = _.without(todos, matchedTodo);
res.json(matchedTodo);
}*/

//  res.send('Matching ids will be deleted from system');
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res){
  var todoId = req.params.id;
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if(body.hasOwnProperty('completed')){
    attributes.completed = body.completed;
  }

  if(body.hasOwnProperty('description')){
    attributes.description = body.description;
  }

  db.todo.findById(todoId).then(function(todo){
    if (todo){
      todo.update(attributes).then(function (todo) {
        res.json(todo.toJSON());
      }, function(e){
        res.status(400).json(e);
      });
    } else {
      res.status(404).send();
    }
  }, function() {
    res.status(500).send();
  })
});

app.post('/users', function(req, res){
  var body = _.pick(req.body, 'email', 'password'); // use _.pick

  // call create on db.todo
  //  respond with 200 and todo
  //  e res.status(400).json(e)

  body.id = userId.toString();

  db.user.create(req.body).then(function(user){
    res.json(user);
    todoNextId++;
  }).catch(function(e){
    res.status(400).json(e);
  });
});

db.sequelize.sync().then(function() {
  db.sequelize.sync({force: true}).then(function() {
  app.listen(PORT, function (){
    console.log('Express listen on port ' + PORT + '!');
  });
});

});
