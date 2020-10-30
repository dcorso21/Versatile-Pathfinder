window.onload = () => {
    const select = (name) => document.querySelector(name),
        selectall = (name) => document.querySelectorAll(name);

    const algoCodes = selectall('.algo-code');

    const algoSelection = select('#algo-select-code');

    algoSelection.onchange = () => {
        console.log('hello');
        [...algoCodes].map((c) => {
            c.style.display = 'none';
            c.classList.remove('fade-in')
            if (c.classList.contains(algoSelection.value)) {
                c.style.display = 'block';
                c.classList.add('fade-in')
            }
        })
        
    }
}