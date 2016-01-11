var person = {
  name: 'Ming Xiang',
  age: 21
};

function updatePerson(obj){
/*  obj = {
    name: 'Ming Xiang',
    age: 24
  }*/
  obj.age = 24;
}

updatePerson(person)
console.log(person);

// Array example


function updateArr1(arr){
  arr.push(1);
}

function updateArr2(arr) {
  arr = [1];
  debugger;
}

list = [];
updateArr1(list);
console.log(list);

list = [];
updateArr2(list);
console.log(list);
