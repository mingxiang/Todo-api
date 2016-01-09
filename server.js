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
  res.json(todos);
});

// GET /todos/:id variable to pass in
app.get('/todos/:id', function(req, res){
  var todoId = req.params.id;
  var matchedTodo = _.findWhere(todos, {id: todoId});

//  var matchingTodo = undefined;
//  console.log(typeof todoId + ': ' + todoId);
//  todos.forEach(function(todo){
//  console.log(typeof todo.id + ': ' + todo.id);
//      if(todo.id === todoId){
//        console.log(matchingTodo);
//      }
//  });

  if(typeof matchingTodo === 'undefined'){
       res.status(404).send();
  }
  else {
    res.json(matchingTodo);
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

app.listen(PORT, function (){
  console.log('Express listen on port ' + PORT + '!');
});
