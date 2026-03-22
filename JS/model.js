const openModelButtons = document.querySelectorAll('[data-model-target]')
const closeModalButtons= document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overly')

openModelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.mdalTarget)
    })
})