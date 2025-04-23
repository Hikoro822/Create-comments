const commentsContainer = document.querySelector('.commentContainer');
const nameInput = document.getElementById('name');
const commentInput = document.getElementById('commentInput');
const dateInput = document.getElementById('date');
const createCommentButton = document.getElementById('button');

document.addEventListener('DOMContentLoaded', loadComments);

createCommentButton.addEventListener('click', () => {
    const userName = nameInput.value.trim();
    const comment = commentInput.value.trim();
    const nowDate = dateInput.value || new Date().toISOString();
    const like = document.createElement('div');
    like.className = 'like';
    like.textContent = '❤️';
    like.addEventListener('click', () => {
        like.classList.toggle('active')
    })

    if (userName && comment) {
        const formattedDate = formatDate(nowDate);
        const commentEl = createCommentElement(userName, comment, formattedDate, like);
        commentsContainer.appendChild(commentEl);

        saveCommentToStorage({ userName, comment, nowDate: formattedDate });

        nameInput.value = ''
        commentInput.value = '';
        dateInput.value = '';
    }
});

const validateInput = () => {
    if (nameInput.value.trim() === '') {
        nameInput.style.border = '1px solid red'
    } else {
        nameInput.style.border = '1px solid black'
    }

    if (commentInput.value.trim() === '') {
        commentInput.style.border = '1px solid red'
    } else {
        commentInput.style.border = '1px solid black'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComments()
    validateInput()
})

nameInput.addEventListener('input', validateInput)
commentInput.addEventListener('input', validateInput)

function formatDate(dateString) {
    const now = new Date();
    const inputDate = new Date(dateString);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const inputDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;


    if (inputDay.getTime() === today.getTime()) {
        return `Сегодня, ${time}`;
    } else if (inputDay.getTime() === yesterday.getTime()) {
        return `Вчера, ${time}`;
    } else {
        const day = String(inputDate.getDate()).padStart(2, '0');
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        return `${day}.${month}.${inputDate.getFullYear()}, ${time}`;
    }
}

function createCommentElement(userName, comment, formattedDate, liked = false) {
    const commentEl = document.createElement('div');
    commentEl.classList.add('comment');

    const like = document.createElement('div');
    like.className = 'like';
    like.textContent = liked ? '❤️' : '🖤';
    if (liked) like.classList.add('active');

    like.addEventListener('click', () => {
        const newLikedState = !like.classList.contains('active');
        like.textContent = newLikedState ? '❤️' : '🖤';
        like.classList.toggle('active');
        updateLike(userName, comment, formattedDate, newLikedState);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.textContent = 'Удалить';

    commentEl.innerHTML = `
        <h2>${userName}</h2>
        <p>${comment}</p>
        <span>${formattedDate}</span>
    `;

    commentEl.appendChild(like);
    commentEl.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', () => {
        commentEl.remove();
        removeCommentFromStorage({ userName, comment, nowDate: formattedDate });
    });

    return commentEl;
}

function saveCommentToStorage(comment) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push({ ...comment, liked: false });
    localStorage.setItem('comments', JSON.stringify(comments));
}

function removeCommentFromStorage(commentToRemove) {
    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments = comments.filter(comment =>
        comment.userName !== commentToRemove.userName ||
        comment.comment !== commentToRemove.comment ||
        comment.nowDate !== commentToRemove.nowDate
    );
    localStorage.setItem('comments', JSON.stringify(comments));
}

const updateLike = (userName, commentText, date, like) => {
    const coments = JSON.parse(localStorage.getItem('comments') || [])
    const updateComments = coments.map(comment => {
        if (comment.userName === userName && comment.comment === commentText && comment.nowDate === date) {
            return { ...comment, liked }
        }
        return comment
    })
    localStorage.setItem('comments', JSON.stringify(updateComments))
}

function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.forEach(comment => {
        const commentEl = createCommentElement(
            comment.userName,
            comment.comment,
            comment.nowDate,
            comment.like,
        );
        commentsContainer.appendChild(commentEl);
    });
}