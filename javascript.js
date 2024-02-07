const openPopButtons = document.querySelectorAll('[data-popup-target]');
const closePopButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
const popupImage = document.querySelector('#pop_up_image');
const popupTitle = document.querySelector('.quiz_name');
const startQuizButton = document.querySelector('.start-quiz');


openPopButtons.forEach(button=>{
    button.addEventListener('click',() =>{
        const popup = document.querySelector(button.dataset.popupTarget)
        const quizTitle = button.dataset.quizTitle;
        const quizImage = button.dataset.quizImage;
    
            // Set the content for the popup
        popupTitle.textContent = quizTitle;
        popupImage.src = quizImage;
        openpopup(popup)
    })
})

closePopButtons.forEach(button=>{
    button.addEventListener('click',() =>{
        const popup = button.closest('.pop-up')
        closepopup(popup)
    })
})
function openpopup(modal){
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}
function closepopup(modal){
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}
overlay.addEventListener('click',() =>{
    const modals =document.querySelectorAll('.pop-up.active')
    modals.forEach(modal => {
        closepopup(modal)
    })
})
startQuizButton.addEventListener('click', () => {
    const quizCategory = popupTitle.textContent;

    // Find the selected quiz questions based on the quiz category
    const selectedQuizQuestions = quizData.filter(question => question.Quiz === quizCategory);

    if (selectedQuizQuestions.length > 0) {
        // Save the selected quiz questions to localStorage
        localStorage.setItem('quizQuestions', JSON.stringify(selectedQuizQuestions));
    } else {
        console.error('Selected quiz questions not found.');
    }

    // Redirect to the quiz page
    window.location.href = 'loading_page.html';
});