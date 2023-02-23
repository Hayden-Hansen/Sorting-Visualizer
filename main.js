const n = 20;
const array = [];
const container = document.getElementById('container');
const initialize = document.getElementById('initialize');
const play = document.getElementById('play');


let audioCtx = null;

const playMusic = (freq) => {
    if (audioCtx == null) {
        audioCtx = new(
            AudioContext || webkitAudioContext || window.webkitAudioContext
        )()
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination)
}


const showBars = (move) => {
    container.innerHTML = '';
    for(let i=0; i< array.length; i++) {
        const bar = document.createElement('div');
        bar.style.height = array[i] * 100 + '%';
        bar.classList.add('bar');

        if(move && move.indices.includes(i)) {
        bar.style.backgroundColor = move.type == 'swap' ? 'red' : 'blue'
    }
    container.appendChild(bar)
}
}

const bubbleSort = (array) => {
    const moves = [];
    for(let i = 0; i < array.length; i++) {
        for(let j = 0; j < (array.length - i - 1); j++) {
            moves.push({indices: [j, j+1], type:'comp'})
            if (array[j] > array[j+1]) {
                let moveBar = array[j];
                array[j] = array[j+1];
                array[j+1] = moveBar;
                moves.push({indices: [j, j+1], type:'swap'})
            }
        }
    }
    return moves
}

const animate = (swaps) => {
    if(swaps.length === 0) {
        showBars();
        return;
    } else {
        const move = swaps.shift();
        const [i,j] = move.indices;
        if(move.type == 'swap') {
            [array[i],array[j]] = [array[j],array[i]]
        }
        playMusic(200+array[i]*500);
        playMusic(200+array[j]*500);
        showBars(move);
        setTimeout(() => {
            animate(swaps)
        }, 25)
    }
}


const init = () => {
    for(let i=0; i<n; i++) {
        array[i] = Math.random();
    };
    showBars();
}

const organize = () => {
    const copyArray = [...array]
    const swaps = bubbleSort(copyArray);
    animate(swaps)
}


const initButtons = () => {
    initialize.addEventListener('click', init);
    play.addEventListener('click', organize)
}



init()
initButtons()
