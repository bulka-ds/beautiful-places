const todoList = [];
const baseTodoId = 'todoitem';

function deleteElement(id) {
  const index = todoList.findIndex(item => item.id === id);
  if (index !== -1) {
    todoList.splice(index, 1);
    document.getElementById(baseTodoId + id).remove();
  }
}

function addToDo() {
  const form = document.forms.toDoForm;
  const title = form.elements.title.value.trim();
  const image = form.elements.image.value.trim();
  const description = form.elements.description.value.trim();

  if (!title || !image) {
    alert("Заполните название и ссылку на изображение!");
    return;
  }

  const newTodo = {
    id: createNewId(),
    title: title,
    image: image,
    description: description
  };

  todoList.push(newTodo);
  addToDoToHtml(newTodo);

  // Очистить форму
  form.reset();
}

function createNewId() {
  return todoList.length === 0
    ? 1
    : Math.max(...todoList.map(todo => todo.id)) + 1;
}

function addToDoToHtml(newToDo) {
  const cardDiv = document.createElement('div');
  cardDiv.id = baseTodoId + newToDo.id;
  cardDiv.className = 'card';

  cardDiv.innerHTML = `
    <img src="${newToDo.image}" alt="${newToDo.title}" onerror="this.src='https://placehold.co/300x180?text=Фото+не+загружено'">
    <div class="card-body">
      <h3>${newToDo.title}</h3>
      <p>${newToDo.description || 'Нет описания.'}</p>
      <button type="button" onclick="deleteElement(${newToDo.id})">Удалить карточку</button>
    </div>
  `;

  document.getElementById('toDoContainer').appendChild(cardDiv);
}