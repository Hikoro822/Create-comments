
const createTaskInput = document.querySelector('.createTaskInput');
const createTaskButton = document.querySelector('.createTaskButton');
const taskContainer = document.querySelector('.task-container');
const deleteAllTask = document.querySelector('.deleteAllTask');
const getName = document.getElementById('getName');

const STORAGE_KEY = 'commentsData';

function getMskTime() {
    const date = new Date();
    return date.toLocaleTimeString('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Функция для сохранения комментариев в localStorage
function saveCommentsToStorage() {
    const comments = [];
    document.querySelectorAll('.comment').forEach(comment => {
        comments.push({
            username: comment.querySelector('.task').textContent.split(': ')[0],
            content: comment.querySelector('.task').textContent.split(': ')[1],
            time: comment.querySelector('.time').textContent,
            isLiked: comment.querySelector('.like').classList.contains('active')
        });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

// Функция для загрузки комментариев из localStorage
function loadCommentsFromStorage() {
    const savedComments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    savedComments.forEach(comment => {
        createCommentElement(comment.username, comment.content, comment.time, comment.isLiked);
    });
}

function createCommentElement(username, content, time, isLiked = false) {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment');

    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.textContent = `${username}: ${content}`;

    const date = document.createElement('div');
    date.classList.add('time');
    date.textContent = time || getMskTime();

    const like = document.createElement('div');
    like.classList.add('like');
    if (isLiked) like.classList.add('active');

    like.addEventListener('click', () => {
        like.classList.toggle('active');
        saveCommentsToStorage();
    });

    commentContainer.append(taskElement, date, like);
    taskContainer.append(commentContainer);
}

// Обработчик для кнопки создания комментария
createTaskButton.addEventListener('click', () => {
    const taskContent = createTaskInput.value.trim();
    const username = getName.value.trim();

    if (taskContent !== '' && username !== '') {
        createCommentElement(username, taskContent);
        saveCommentsToStorage();
        createTaskInput.value = '';
        getName.value = '';
    }
});

deleteAllTask.addEventListener('click', () => {
    taskContainer.innerHTML = '';
    localStorage.removeItem(STORAGE_KEY);
});

document.addEventListener('DOMContentLoaded', loadCommentsFromStorage);

