const createTaskInput = document.querySelector('.createTaskInput');
const createTaskButton = document.querySelector('.createTaskButton');
const taskContainer = document.querySelector('.task-container');
const deleteAllTask = document.querySelector('.deleteAllTask');
const getName = document.getElementById('getName');
const like = document.createElement('div')

function getMskTime() {
    const date = new Date();
    return date.toLocaleTimeString('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

createTaskButton.addEventListener('click', () => {

    const taskElement = document.createElement('div')
    const taskContent = createTaskInput.value.trim()
    const date = document.createElement('div')
    const username = getName.value.trim();

    if (taskContent !== '' && username !== '') {
        taskElement.classList.add('task');
        taskElement.textContent = `${username}: ${taskContent}`;
        date.textContent = getMskTime();
        date.classList.add('time');
        like.classList.add('like')

        taskContainer.append(taskElement);
        taskContainer.append(date);
        taskContainer.append(like)
        createTaskInput.value = '';
        getName.value = '';
    }
});

deleteAllTask.addEventListener('click', () => {
    taskContainer.innerHTML = ''
})

like.addEventListener('click', () => {
    like.classList.toggle('active')
})
// console.log(getName)
