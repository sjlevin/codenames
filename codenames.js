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
    newSeed();
    newGame();
};

function stringSeedToInt(stringSeed) {
    return parseInt(stringSeed, 36);
}

function intSeedToString(intSeed) {
    return intSeed.toString(36);
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function incrementSeed() {  
    var stringSeed = intSeedToString(seed);
    for(i = seedLength - 1; i >= 0; i--) {
        var c = String.fromCharCode(stringSeed.charCodeAt(i) + 1);
        if(c == "{") {
            c = "a";
            stringSeed = stringSeed.replaceAt(i, c);
        }
        else {
            stringSeed = stringSeed.replaceAt(i, c);
            break;
        }
    }
    
    seed = stringSeedToInt(stringSeed);    
}

function newSeed() {
    var tempSeed = "";
    var a = "a".charCodeAt(0);
    var alphabetSize = 26;
    
    Math.seedrandom();

    for(var i = 0; i < seedLength; ++i)
    {
        var offset = Math.floor(alphabetSize * Math.random());
        tempSeed += String.fromCharCode(a + offset);
    }
        
    var intSeed = stringSeedToInt(tempSeed);
    seed = intSeed;
    
    while(seed % 16) {
        incrementSeed();
    }
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
        alert("'" + loadSeed + "' is not a valid Game ID");
    } else {
        var intSeed = stringSeedToInt(loadSeed);
        seed = intSeed;
        generateGame();
    }
}

function newGame() {
    incrementSeed();
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
    wordList = getRandomWordList();
    
    var answers = getAnswerList();
    answerList = answers[0];
    startColor = answers[1];
    
    resetAnwersButton();
    
    var text = "<b>First Team:</b> <span style='color:" + cssColors[startColor] + "'>" + colorNames[startColor] + "</span><br /><b>Game ID:</b> " + intSeedToString(seed);
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
    var wordArray = [];
    var masterArrayClone = masterWordList.slice(0);
    
    var seedInt = stringSeedToInt(seed);
    var randomizerIndex = seedInt & 0xF; //todo: use this
    var randomizerSeed = seedInt - randomizerIndex;
    
    Math.seedrandom(randomizerSeed);
    shuffleArray(masterArrayClone);
    
    for(i = 0, j = randomizerIndex * 16; i < gameSize; ++i, j++) {
        wordArray[i] = masterArrayClone[j];
    }
    
    return wordArray;
    
}

function getAnswerList() {
    var startColor;
    
    Math.seedrandom(seed);

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
