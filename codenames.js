var colors = {
    RED: 0,
    BLUE: 1,
    NEUTRAL: 2,
    ASSASSIN: 3,
    DEFAULT: 4,
    NUMCOLORS: 5
};
var colorNames = ["Red", "Blue", "Neutral", "Assassin", "Default", "NumColors"];
var cssColors = ["Crimson", "SteelBlue", "Wheat", "DimGray", "Cornsilk"];

var seed;
var wordList = [];
var answerList = [];
var startColor;
var gameSize = 25;
var seedLength = 5;
var enableInvertedText = false;

<!-- Load the updateText on first load for now -->
window.onload = function() {
    newGame();
};

function newSeed() {
    var newSeed = "";
    var a = "a".charCodeAt(0);
    var alphabetSize = 26;
    
    for(var i = 0; i < seedLength; ++i)
    {
        var offset = Math.floor(alphabetSize * Math.random());
        newSeed += String.fromCharCode(a + offset);
    }
    seed = newSeed;
}

function loadGame() {
    var loadSeed = prompt("Please enter a Game ID");
    if(loadSeed == undefined) {
        return;
    }
    var regString = "^[a-z]{" + seedLength + "}$";
    var re = new RegExp(regString);
    var match = loadSeed.match(re);
    
    if(match == null) {
        alert("'" + loadSeed + "' is not a valid seed");
    } else {
        seed = loadSeed;
        generateGame();
    }
}

function newGame() {
    newSeed();
    generateGame();
}

function resetAnwersButton() {
    var button = document.getElementById('AnswersButton');
    if(button.value != "hidden") {
        button.innerHTML = "Show Answers";
        button.value = "hidden";
    }
}

function generateGame() {                
    Math.seedrandom(seed);

    wordList = getRandomWordList();
    
    var answers = getAnswerList();
    answerList = answers[0];
    startColor = answers[1];
    
    resetAnwersButton();
    
    var text = "<b>First Team:</b> <span style='color:" + cssColors[startColor] + "'>" + colorNames[startColor] + "</span><br /><b>Game ID:</b> " + seed;
    document.getElementById("Text1").innerHTML = text;
    
    createTable();
}

function shuffleArray(array) {
    // Fisher-Yates shuffle
    
    var i = array.length, temp, index;
    while (i > 0) {
        index = Math.floor(i * Math.random());
        --i;
        temp = array[index];
        array[index] = array[i];
        array[i] = temp;
    }
}

function getRandomWordList() {
    // Floyd's Random Sample algorithm
    var wordSet = {};
    
    for(var i = masterWordList.length - gameSize; i < masterWordList.length; ++i) {
        var j = Math.floor(i * Math.random());
        var iWord = masterWordList[i];
        var jWord = masterWordList[j];
        
        if(wordSet[masterWordList[j]] == undefined) {
            wordSet[masterWordList[j]] = "null";
        } else {
            wordSet[masterWordList[i]] = "null";
        }
    }
    
    var wordArray = Object.keys(wordSet).sort();
    shuffleArray(wordArray);
    
    return wordArray;
}

function getAnswerList() {
    var startColor;
    if(Math.random() >= .5) {
        startColor = colors.RED
    } else {
        startColor = colors.BLUE
    }
    
    var answerList = [
        colors.ASSASSIN,
        colors.NEUTRAL, colors.NEUTRAL, colors.NEUTRAL, colors.NEUTRAL, colors.NEUTRAL, colors.NEUTRAL, colors.NEUTRAL,
        colors.RED, colors.RED, colors.RED, colors.RED, colors.RED, colors.RED, colors.RED, colors.RED, 
        colors.BLUE, colors.BLUE, colors.BLUE, colors.BLUE, colors.BLUE, colors.BLUE, colors.BLUE, colors.BLUE,
        startColor
    ];
    
    shuffleArray(answerList);
    
    return [answerList, startColor];
}

function createTable() {
    var tbl = document.getElementById('Table1'), tr;
    tbl.innerHTML = "";
    
    for(var i = 0; i < gameSize; ++i) {
        
        if((i % 5) == 0) {
            tr = tbl.insertRow();
        }
        var td = tr.insertCell();
        var word = wordList[i];
        var text;
        if(enableInvertedText) {
            text = "<span class='txtInverted'>"+ word + "</span><br /><span class='txtNormal'>" + word + "</span>";
        } else {
            text = "<span class='txtNormal'>" + word + "</span>";
        }
        td.innerHTML = text;
        td.style.backgroundColor = cssColors[colors.DEFAULT];
        
        var color = cssColors[answerList[i]]
        
        td.onclick = (function() {
            var currentColor = color;
            return function() {
                changeColor(this, currentColor);
            }
        })();
    }
}

function changeColor(elem, color) {
    elem.style.backgroundColor = color;
    if(elem.style.color.toUpperCase() == color.toUpperCase()) {
        elem.style.color = "Black";
    } else {
        elem.style.color = color;
    }
}

function showAnswers() {
    var tbl = document.getElementById('Table1');
    var button = document.getElementById('AnswersButton');
    var reveal;
    var color;
    
    if(button.value == "hidden") {
        reveal = true;
        button.innerHTML = "Hide Answers";
        button.value = "revealed";
    } else {
        reveal = false;
        button.innerHTML = "Show Answers";
        button.value = "hidden";
    }
    
    for (var i = 0, row; row = tbl.rows[i]; ++i) {
        for(var j = 0, cell; cell = row.cells[j]; ++j) {
            if(reveal) {
                color = cssColors[answerList[i*5+j]];
            } else {
                color = cssColors[colors.DEFAULT];
            }
            
            cell.style.backgroundColor = color;
            cell.style.color = "Black";
        }
    }    
}

function toggleInvertedText() {
    var button = document.getElementById('ToggleInvertedButton');
    
    if(button.value == "enabled") {
        enableInvertedText = false;
        button.innerHTML = "Inverted Text";
        button.value = "disabled";

    } else {
        enableInvertedText = true;
        button.innerHTML = "Normal Text";
        button.value = "enabled";
    }
    
    createTable();
    resetAnwersButton();
}
