var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

// model
var todos = [{
  id: '1',
  description: 'Meet for lunch',
  completed: false
}, {
  id: '2',
  description: 'Go to market',
  completed: false
}, {
  id: '3',
  description: 'DOTO @ 11pm',
  completed: true
}];

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
  var matchingTodo = undefined;

  //console.log(typeof todoId + ': ' + todoId);
  todos.forEach(function(todo){
//  console.log(typeof todo.id + ': ' + todo.id);
      if(todo.id === todoId){
        matchingTodo = todo;
//        console.log(matchingTodo);
      }
  });

  if(typeof matchingTodo === 'undefined'){
       res.status(404).send();
  }
  else {
    res.json(matchingTodo);
  }
  //res.send('Asking for todo with id of ' + req.params.id);

});

app.listen(PORT, function (){
  console.log('Express listen on port ' + PORT + '!');
});
