
let undoStack = [];
let chartInstance = null;

let gameData = {
round: 1,
targetScore: 1000,
players: [],
history: [],
chartHistory: [],
darkMode: true
};

function createPlayer(id, name){
return {
id,
name,
score: 0,
stars: 0,
burns: 0,
burned: 0,
tripleBurn: 0,
highestScore: 0
};
}

function saveData(){
localStorage.setItem(
"scoreCekihData",
JSON.stringify(gameData)
);
}

function loadData(){

```
const saved =
    localStorage.getItem(
        "scoreCekihData"
    );

if(!saved) return;

gameData =
    JSON.parse(saved);

document
    .getElementById("setupScreen")
    .classList.add("hidden");

document
    .getElementById("gameScreen")
    .classList.remove("hidden");

document
    .getElementById("roundNumber")
    .textContent =
    gameData.round;

renderPlayers();
renderRanking();
renderHistory();
renderAchievements();
renderStatistics();
```

}

function speak(text){

```
if(
    !window.speechSynthesis
) return;

const utterance =
    new SpeechSynthesisUtterance(
        text
    );

utterance.lang =
    "id-ID";

utterance.rate = 1;

speechSynthesis.speak(
    utterance
);
```

}

function startGame(){

    alert("START JALAN");

    const p1 =
        document.getElementById(
            "player1"
        ).value.trim();
```
const p1 =
    document.getElementById(
        "player1"
    ).value.trim();

const p2 =
    document.getElementById(
        "player2"
    ).value.trim();

const p3 =
    document.getElementById(
        "player3"
    ).value.trim();

const p4 =
    document.getElementById(
        "player4"
    ).value.trim();

const target =
    parseInt(
        document.getElementById(
            "targetScore"
        ).value
    ) || 1000;

gameData = {

    round: 1,

    targetScore:
        target,

    history: [],

    chartHistory: [],

    darkMode: true,

    players: [

        createPlayer(
            1,
            p1 || "Pemain A"
        ),

        createPlayer(
            2,
            p2 || "Pemain B"
        ),

        createPlayer(
            3,
            p3 || "Pemain C"
        ),

        createPlayer(
            4,
            p4 || "Pemain D"
        )

    ]
};

saveData();

document
    .getElementById(
        "setupScreen"
    )
    .classList.add(
        "hidden"
    );

document
    .getElementById(
        "gameScreen"
    )
    .classList.remove(
        "hidden"
    );

renderPlayers();
renderRanking();
renderHistory();
renderAchievements();
renderStatistics();
```

}

function renderPlayers(){

```
const container =
    document.getElementById(
        "playersContainer"
    );

container.innerHTML = "";

gameData.players
    .forEach(player=>{

    container.innerHTML += `
        <div class="player-card">

            <div class="player-name">
                ${player.name}
            </div>

            <div class="player-score">
                ${player.score}
            </div>

            <div class="player-stars">
                ⭐ ${player.stars}
            </div>

        </div>
    `;

});
```

}

function renderRanking(){

```
const ranking =
    [...gameData.players]
    .sort(
        (a,b)=>
        b.score-a.score
    );

const box =
    document.getElementById(
        "rankingList"
    );

box.innerHTML = "";

ranking.forEach(
    (player,index)=>{

    box.innerHTML += `
        <div class="rank-item">

            ${index+1}.
            ${player.name}

            (${player.score})

        </div>
    `;

});
```

}

function renderHistory(){

```
const box =
    document.getElementById(
        "historyList"
    );

box.innerHTML = "";

[...gameData.history]
.reverse()
.forEach(item=>{

    box.innerHTML += `
        <div class="history-item">

            ${item}

        </div>
    `;

});
```

}

function checkWinner(player){

```
if(
    player.score <
    gameData.targetScore
) return;

player.stars++;

speak(
    `Selamat kepada ${player.name} mendapatkan bintang satu`
);

gameData.history.push(
    `⭐ ${player.name} mendapatkan bintang`
);

gameData.players
.forEach(p=>{

    p.score = 0;

});
```

}

function checkBurnSystem(
playerId,
oldScores
){

```
if(
    gameData.round <= 1
) return;

const attacker =
    gameData.players.find(
        p=>p.id===playerId
    );

const attackerOld =
    oldScores.find(
        p=>p.id===playerId
    );

let burnCount = 0;

oldScores.forEach(
    oldPlayer=>{

    if(
        oldPlayer.id === playerId
    ) return;

    const target =
        gameData.players.find(
            p=>
            p.id===
            oldPlayer.id
        );

    if(
        target.score <= 0
    ) return;

    const wasBelow =
        attackerOld.score <
        oldPlayer.score;

    const nowAbove =
        attacker.score >
        target.score;

    if(
        wasBelow &&
        nowAbove
    ){

        target.score = 0;

        attacker.burns++;

        target.burned++;

        burnCount++;

        gameData.history.push(
            `🔥 ${attacker.name} membakar ${target.name}`
        );

        speak(
            `${attacker.name} membakar ${target.name}`
        );

    }

});

if(
    burnCount >= 3
){

    attacker.tripleBurn++;

    gameData.history.push(
        `💣 TRIPLE BURN - ${attacker.name}`
    );

    speak(
        "Triple Burn"
    );

}
```

}

function saveRound(){

```
undoStack.push(
    JSON.stringify(
        gameData
    )
);

const values = [

    parseInt(
        document.getElementById(
            "roundP1"
        ).value
    ) || 0,

    parseInt(
        document.getElementById(
            "roundP2"
        ).value
    ) || 0,

    parseInt(
        document.getElementById(
            "roundP3"
        ).value
    ) || 0,

    parseInt(
        document.getElementById(
            "roundP4"
        ).value
    ) || 0

];

const oldScores =
    JSON.parse(
        JSON.stringify(
            gameData.players
        )
    );

gameData.players
.forEach(
    (player,index)=>{

    player.score +=
        values[index];

    if(
        player.score >
        player.highestScore
    ){

        player.highestScore =
            player.score;

    }

    gameData.history.push(
        `${player.name} ${values[index] >=0 ? "+" : ""}${values[index]}`
    );

});

gameData.players
.forEach(player=>{

    checkBurnSystem(
        player.id,
        oldScores
    );

    checkWinner(
        player
    );

});

gameData.chartHistory.push({

    round:
        gameData.round,

    scores:
        gameData.players.map(
            p=>p.score
        )

});

saveData();

renderPlayers();
renderRanking();
renderHistory();

document
.getElementById(
    "roundP1"
).value = "";

document
.getElementById(
    "roundP2"
).value = "";

document
.getElementById(
    "roundP3"
).value = "";

document
.getElementById(
    "roundP4"
).value = "";
```

  }

function renderAchievements(){

```
const box =
    document.getElementById(
        "achievementList"
    );

box.innerHTML = "";

gameData.players.forEach(
    player=>{

    let badges = [];

    if(
        player.score < 0
    ){

        badges.push(
            "👎 Tukang Ngocok Kartu"
        );

    }

    if(
        player.burns >= 3
    ){

        badges.push(
            "🔥 Tukang Bakar"
        );

    }

    if(
        player.burned >= 5
    ){

        badges.push(
            "💀 Hari Apes Gak Ada Yang Tau"
        );

    }

    if(
        player.highestScore >= 500
    ){

        badges.push(
            "👑 Dewa Kartu"
        );

    }

    if(
        player.stars > 1
    ){

        badges.push(
            "⭐ Dewa Dari Segala Dewa"
        );

    }

    if(
        player.tripleBurn > 0
    ){

        badges.push(
            "💣 Triple Burn"
        );

    }

    box.innerHTML += `
        <div class="achievement-item">

            <b>
                ${player.name}
            </b>

            <br><br>

            ${
                badges.length
                ? badges.join("<br>")
                : "Belum ada achievement"
            }

        </div>
    `;

});
```

}

function renderStatistics(){

```
const box =
    document.getElementById(
        "statisticsList"
    );

box.innerHTML = "";

gameData.players.forEach(
    player=>{

    box.innerHTML += `
        <div class="stat-item">

            <b>
                ${player.name}
            </b>

            <br>

            Score :
            ${player.score}

            <br>

            High Score :
            ${player.highestScore}

            <br>

            Bintang :
            ${player.stars}

            <br>

            Membakar :
            ${player.burns}

            <br>

            Terbakar :
            ${player.burned}

            <br>

            Triple Burn :
            ${player.tripleBurn}

        </div>
    `;

});
```

}

function nextRound(){

```
gameData.round++;

document
    .getElementById(
        "roundNumber"
    )
    .textContent =
    gameData.round;

gameData.history.push(
    `➡️ Masuk ronde ${gameData.round}`
);

saveData();

renderHistory();
```

}

function undoAction(){

```
if(
    undoStack.length===0
) return;

gameData =
    JSON.parse(
        undoStack.pop()
    );

saveData();

renderPlayers();
renderRanking();
renderHistory();
renderAchievements();
renderStatistics();
```

}

function resetGame(){

```
if(
    !confirm(
        "Reset permainan?"
    )
) return;

localStorage.removeItem(
    "scoreCekihData"
);

location.reload();
```

}

function toggleTheme(){

```
document.body.classList.toggle(
    "light-mode"
);
```

}

function toggleFullscreen(){

```
if(
    !document.fullscreenElement
){

    document
        .documentElement
        .requestFullscreen();

}else{

    document
        .exitFullscreen();

}
```

}

document
.querySelectorAll(
".tab-btn"
)
.forEach(btn=>{

```
btn.addEventListener(
    "click",
    ()=>{

        document
        .querySelectorAll(
            ".tab-btn"
        )
        .forEach(
            b=>b.classList.remove(
                "active"
            )
        );

        btn.classList.add(
            "active"
        );

        document
        .querySelectorAll(
            ".tab-content"
        )
        .forEach(
            tab=>tab.classList.add(
                "hidden"
            )
        );

        document
        .getElementById(
            btn.dataset.tab +
            "Tab"
        )
        .classList.remove(
            "hidden"
        );

    }
);
```

});

document
.getElementById(
"startGame"
)
.addEventListener(
"click",
startGame
);

document
.getElementById(
"saveRoundBtn"
)
.addEventListener(
"click",
saveRound
);

document
.getElementById(
"nextRoundBtn"
)
.addEventListener(
"click",
nextRound
);

document
.getElementById(
"undoBtn"
)
.addEventListener(
"click",
undoAction
);

document
.getElementById(
"resetBtn"
)
.addEventListener(
"click",
resetGame
);

document
.getElementById(
"themeBtn"
)
.addEventListener(
"click",
toggleTheme
);

document
.getElementById(
"fullscreenBtn"
)
.addEventListener(
"click",
toggleFullscreen
);

loadData();
