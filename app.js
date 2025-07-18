document.addEventListener('DOMContentLoaded', () => {
    const energyField = document.getElementById('energy-field');
    const sideRadios = document.querySelectorAll('input[name="hernia-side"]');
    const startButton = document.getElementById('start-healing-btn');

    let selectedSide = 'right'; // Default side
    energyField.classList.add('right');

    sideRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            selectedSide = event.target.value;
            if (selectedSide === 'left') {
                energyField.classList.remove('right');
                energyField.classList.add('left');
            } else {
                energyField.classList.remove('left');
                energyField.classList.add('right');
            }
        });
    });

    startButton.addEventListener('click', () => {
        window.location.href = `healing.html?side=${selectedSide}`;
    });
});

