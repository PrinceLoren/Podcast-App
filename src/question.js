export class Question {
    static create(question) {
        return fetch('https://podcast-github-app-default-rtdb.europe-west1.firebasedatabase.app/question.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                question.id = response.name
                return question
            })
            .then(addToLocalStorage)
            .then(Question.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">You dont have a Token </p>')
        }
        return fetch(`https://podcast-github-app-default-rtdb.europe-west1.firebasedatabase.app/question.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
               if (response && response.error) {
                   return `<p class="error">${response.error}</p>`
               }

               return response ? Object.keys(response).map(key => ({
                   ...response[key],
                   id: key
               })) : []
            })
    }

    static renderList() {
        const questions = getQuestionFromLocalStorage()

        const html = questions.length
            ? questions.map(toCard).join('')
            : `<div class="mui--text-black-54 mui--text-body2">No Question</div>`

        const list = document.getElementById('list')
        list.innerHTML = html
    }

    static listToHTML(questions) {
        return questions.length
        ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
            : '<p>No questions</p>'
    }
}

function addToLocalStorage(question) {
    const all = getQuestionFromLocalStorage()
    all.push(question)

    localStorage.setItem('question', JSON.stringify(all))
}

function getQuestionFromLocalStorage() {
    return JSON.parse(localStorage.getItem('question') || '[]')
}

function toCard(question) {
    return `
     <div class="mui--text-black-54">
        ${new Date(question.date).toLocaleDateString()}
        ${new Date(question.date).toLocaleTimeString()}
     </div>
     <div>
     ${question.text}
     </div>
     <br>
    `
}