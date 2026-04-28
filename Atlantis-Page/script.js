document.querySelector(".avatar").onclick = function() {
    alert("I am the Guardian of Atlantis...");
}


document.querySelector(".card-1").onclick = () => {
    document.getElementById("popup1").style.display = "flex";
};

document.querySelector(".card-2").onclick = () => {
    document.getElementById("popup2").style.display = "flex";
};

document.querySelector(".card-3").onclick = () => {
    document.getElementById("popup3").style.display = "flex";
};

document.querySelector(".card-4").onclick = () => {
    document.getElementById("popup4").style.display = "flex";
};


document.querySelectorAll(".close").forEach(btn => {
    btn.onclick = () => {
        btn.closest(".popup").style.display = "none";
    };
});

function toggleAudio(icon) {
    const audio = document.getElementById("brief-audio");

    if (audio.paused) {
        audio.play();
        icon.textContent = "⏹️"; 
    } else {
        audio.pause();
        audio.currentTime = 0;
        icon.textContent = "🕪";
    }
}