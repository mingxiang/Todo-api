var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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

app.use(bodyParser.json());

app.get('/',function (req, res){
  res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
  var queryParams = req.query;
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
  res.json(filteredTodos);
});

// GET /todos/:id variable to pass in
app.get('/todos/:id', function(req, res){
  var todoId = req.params.id;


  var matchedTodo = _.findWhere(todos, {id: todoId});
  console.log(matchedTodo);
//  var matchingTodo = undefined;
//  console.log(typeof todoId + ': ' + todoId);
//  todos.forEach(function(todo){
//  console.log(typeof todo.id + ': ' + todo.id);
//      if(todo.id === todoId){
//        console.log(matchingTodo);
//      }
//  });

  if(typeof matchedTodo === 'undefined'){
       res.status(404).send();
  }
  else {
    res.json(matchedTodo);
  }
  //res.send('Asking for todo with id of ' + req.params.id);

});

// POST /todos can take data
app.post('/todos', function(req, res){
  var body = _.pick(req.body, 'description', 'completed'); // use _.pick

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
});

// DELETE /todos/:id

app.delete('/todos/:id',function(req, res){
  var todoId = req.params.id;
//  todos = _.reject(todos,function(todo){
//    return todo.id === todoId;
//  });

  var matchedTodo = _.findWhere(todos, {id: todoId});

  if(!matchedTodo) {
    res.status(404).json({"error": "no todo found with that id"});
  } else {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  }

//  res.send('Matching ids will be deleted from system');
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res){
  var todoId = req.params.id;
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if(!matchedTodo) {
    return res.status(404).send();
  }

  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});

app.listen(PORT, function (){
  console.log('Express listen on port ' + PORT + '!');
});
