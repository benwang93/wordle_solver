var wordLength = 5;

var numGridRows = 0;

let COLOR_UNUSED = "gray";
let COLOR_WRONG_SPOT = "yellow";
let COLOR_CORRECT = "green";


function initLetterCounts() {
    var map = {}
    for (let i = 0; i < 26; i++) {
        map[String.fromCharCode(i + 97)] = 0;
    }
    return map;
}

function debugLogCharCounts(charCounts) {
    for (let i = 0; i < 26; i++) {
        console.log("Count " + String.fromCharCode(i + 97) + ": " + charCounts[String.fromCharCode(i + 97)]);
    }
}

function calculateWordScores(wordList, charScores) {
    var wordScores = [];
    for (let word of wordList) {
        var wordScore = 0;
        var countedLetters = [];

        for (let c of word) {
            if (!countedLetters.includes(c)) {
                wordScore += charScores[c];
                countedLetters.push(c);
            }
        }

        wordScores.push({
            word: word,
            score: wordScore
        });
    }

    return wordScores
}

// *********************************************
// Filter functions
// *********************************************
var disallowedLetters = [];
var requiredLetters = [];
var incorrectGuessesArray = [];
var correctLetters = [];

function filterWordLengthX(word, length) {
    return word.length == length;
}

function filterAddS(word) {
    return filterWordLengthX(word, wordLength - 1) && (word.slice(-1) != "s");
}

function filterWordLength(word) {
    return filterWordLengthX(word, wordLength);
}

function filterDisallowedLetters(word) {
    for (let c of disallowedLetters) {
        if (word.includes(c)) {
            return false;
        }
    }

    return true;
}

function filterRequiredLetters(word) {
    for (let c of requiredLetters) {
        if (!word.includes(c)) {
            return false;
        }
    }

    return true;
}

function filterKnownLettterPositions(word) {
    for (let i = 0; i < wordLength; i++) {
        if ((correctLetters[i].length > 0) && (word[i] != correctLetters[i])) {
            return false;
        }
    }

    return true;
}

function filterIncorrectGuesses(word) {
    for (let i = 0; i < wordLength; i++) {
        if (incorrectGuessesArray[i].includes(word[i])) {
            return false;
        }
    }

    return true;
}

// *********************************************
// Update functions
// *********************************************

function updateWordsTable(wordList, outputTableId, columnName) {
    var outputTable = document.getElementById(outputTableId);
    outputTable.innerHTML = "";

    // Sort word list by score
    // TODO: Make this filter selectable (score up/down, alphabetical up/down)
    wordList.sort((a, b) => {
        // Sort descending order by score
        return b.score - a.score;
    });

    // Create table header
    let headerRow = document.createElement('tr');
    let wordCol = document.createElement('td');
    let scoreCol = document.createElement('td');
    wordCol.innerHTML = "<b>" + columnName + "</b>";
    scoreCol.innerHTML = "<b>Score</b>";
    headerRow.appendChild(wordCol);
    headerRow.appendChild(scoreCol);
    outputTable.appendChild(headerRow);

    // Display filtered results
    // for (let i = 0; i < 10; i++) {
    //     let word = wordList[i];
    //     let row = document.createElement('tr');
    //     let wordCol = document.createElement('td');
    //     let scoreCol = document.createElement('td');
    //     wordCol.innerHTML = '<a href="https://www.dictionary.com/browse/' + word.word + '" target="_blank">' + word.word + '</a>';
    //     scoreCol.innerHTML = word.score;
    //     row.appendChild(wordCol);
    //     row.appendChild(scoreCol);
    //     outputTable.appendChild(row);
    // }
    wordList.forEach(function (word) {
        let row = document.createElement('tr');
        let wordCol = document.createElement('td');
        let scoreCol = document.createElement('td');
        wordCol.innerHTML = '<a href="https://www.dictionary.com/browse/' + word.word + '" target="_blank">' + word.word + '</a>';
        scoreCol.innerHTML = word.score;
        row.appendChild(wordCol);
        row.appendChild(scoreCol);
        outputTable.appendChild(row);
    });
}

function updatePossibleWords(wordList, charScores) {
    // Calculate score for each word
    var possibleWordScores = calculateWordScores(wordList, charScores);

    updateWordsTable(possibleWordScores, "outputTable", "Possible solution");
}

// Of the remaining words, what are the unknown letters remaining and how many words can we eliminate, starting with most popular letters
// Set letters that are already known as 0
// - wordList: Words of correct length ONLY, don't apply other filters
// - charScores: scores of letters from real filters
function updateWeederWords(wordList, charScores) {
    console.log("updateWeederWords");

    // Update charScores to prioritize discovering new words
    // Don't care whether letters are in the right or wrong place
        // var filteredLengthWords = words.filter(filterWordLength);
        // filteredWords = filteredLengthWords.filter(filterDisallowedLetters);
        // filteredWords = filteredWords.filter(filterRequiredLetters);
        // filteredWords = filteredWords.filter(filterIncorrectGuesses);
        // filteredWords = filteredWords.filter(filterKnownLettterPositions);
    // All previously seen (whether correct or incorrect) letters have a score of 0
    for (let c of disallowedLetters) {
        charScores[c] = 0;
    }
    for (let c of requiredLetters) {
        charScores[c] = 0;
    }

    // Calculate score for each word
    var possibleWordScores = calculateWordScores(wordList, charScores);

    updateWordsTable(possibleWordScores, "outputTableEliminate", "Weeder word");
}

function updateResults() {
    // Clear out current state
    var lettersToExclude = "";
    var lettersToInclude = "";
    incorrectGuessesArray = [];
    correctLetters = [];

    for (let c = 0; c < wordLength; c++) {
        incorrectGuessesArray.push([]);
        correctLetters.push([]);
    }

    // Parse grid into expected string format
    var rowFull = true;

    for (let r = 0; r < numGridRows; r++) {
        rowFull = true;

        for (let c = 0; c < wordLength; c++) {
            var textBox = document.getElementById("wordLetterR" + r + "C" + c);
            
            // Only process if cell has value
            if (textBox.value.length > 0) {
                let currLetter = textBox.value[0].toLowerCase();

                switch (textBox.style.backgroundColor) {
                    case COLOR_UNUSED:
                        lettersToExclude += currLetter;
                        break;
                    case COLOR_WRONG_SPOT:
                        lettersToInclude += currLetter;
                        incorrectGuessesArray[c] += currLetter;
                        break;
                    case COLOR_CORRECT:
                        lettersToInclude += currLetter;
                        correctLetters[c] = currLetter;
                        break;
                }
            }
            else
            {
                console.log("R" + r + "C" + c + ": empty!")
                rowFull = false;
            }
        }
    }

    // Add a new row if previous row was used
    if (rowFull) {
        addWordGridRow();
    }

    // Now filter words
    console.log("Trying to read word list...");
    var req = new XMLHttpRequest();
    req.onload = function () {
        console.log("Got response");
        document.getElementById("numResultsHeading").innerHTML = "Heard-ling the word-lings...";

        var words = this.responseText.split("\n");
        words = words.map(s => s.trim());

        console.log("Originally found " + words.length + " words");

        disallowedLetters = lettersToExclude;
        requiredLetters = lettersToInclude;

        // Grab all 4-letter words that don't end in "s" and append "s"
        console.log("Original num words: " + words.length);
        var words = [...new Set(words)];
        console.log("After unique or original: " + words.length);
        var wordsAddS = words.filter(filterAddS);
        console.log("Words to add s: " + wordsAddS.length);
        console.log(wordsAddS);
        for (let i = 0; i < wordsAddS.length; i++) {
            wordsAddS[i] += "s";
        }
        words = words.concat(wordsAddS);
        console.log("After concat: " + words.length);
        var words = [...new Set(words)];
        console.log("After unique: " + words.length);

        var filteredLengthWords = words.filter(filterWordLength);
        filteredWords = filteredLengthWords.filter(filterDisallowedLetters);
        filteredWords = filteredWords.filter(filterRequiredLetters);
        filteredWords = filteredWords.filter(filterIncorrectGuesses);
        filteredWords = filteredWords.filter(filterKnownLettterPositions);

        console.log("Number of " + wordLength + "-letter words: " + filteredWords.length + " words");
        document.getElementById("numResultsHeading").innerHTML = filteredWords.length + " Possible Results";

        // Now score remaining words
        // Start by gathering stats on occurrence of letters
        var charCounts = initLetterCounts();

        for (let word of filteredWords) {
            for (let c of word) {
                charCounts[c]++;
            }
        }

        debugLogCharCounts(charCounts);

        // Update list of possible words
        updatePossibleWords(filteredWords, charCounts);

        // Of the remaining words, what are the unknown letters remaining and how many words can we eliminate, starting with most popular letters
        // Set letters that are already known as 0
        updateWeederWords(filteredLengthWords, charCounts);
    }
    req.open('GET', './wordlist.txt');
    req.send();
}

// *********************************************
// UI functions
// *********************************************

function addWordGridRow() {
    console.log("addWordGridRow called for row number: " + numGridRows)

    let rowNum = numGridRows;

    var wordGrid = document.getElementById("wordGrid");

    // Create table for entering good and bad letters
    let newRow = document.createElement('tr');
    let buttonRow = document.createElement('tr');

    for (let i = 0; i < wordLength; i++) {
        let newCol = document.createElement('td');
        let buttonCol = document.createElement('td');

        // Default color
        newCol.style.backgroundColor = COLOR_UNUSED;

        newCol.id = 'wordCellR' + rowNum + 'C' + i;

        newCol.innerHTML += '<input type="text" name="wordLetterR' + rowNum + 'C' + i + '" id="wordLetterR' + rowNum + 'C' + i + '" value="" style="width: 40px; font-size: 42px; background-color: ' + COLOR_UNUSED + '">';
        buttonCol.innerHTML += '<input name="wordButtonR' + rowNum + 'C' + i + '" id="wordButtonR' + rowNum + 'C' + i + '" type="button" value="Toggle" onclick="toggleState(' + rowNum + ', ' + i + ');" />';
        newRow.appendChild(newCol);
        buttonRow.appendChild(buttonCol);
    }
    wordGrid.appendChild(newRow);
    wordGrid.appendChild(buttonRow);

    numGridRows++;
}

function toggleState(rowNum, colNum) {
    console.log("toggleState called for row " + rowNum + ", col " + colNum);
    console.log("key is " + "wordLetterR" + rowNum + "C" + colNum)

    var textBox = document.getElementById("wordLetterR" + rowNum + "C" + colNum);
    var cell = document.getElementById("wordCellR" + rowNum + "C" + colNum);

    console.log(" -> wordGrid.style.backgroundColor is " + cell.style.backgroundColor);

    switch (textBox.style.backgroundColor) {
        case COLOR_UNUSED:
            cell.style.backgroundColor = COLOR_WRONG_SPOT;
            textBox.style.backgroundColor = COLOR_WRONG_SPOT;
            break;
        case COLOR_WRONG_SPOT:
            cell.style.backgroundColor = COLOR_CORRECT;
            textBox.style.backgroundColor = COLOR_CORRECT;
            break;
        case COLOR_CORRECT:
            cell.style.backgroundColor = COLOR_UNUSED;
            textBox.style.backgroundColor = COLOR_UNUSED;
            break;
    }
}

function resetGrid() {
    disallowedLetters = [];
    requiredLetters = [];
    incorrectGuessesArray = [];
    correctLetters = [];
    
    // Clear out grid
    var wordGrid = document.getElementById("wordGrid");
    wordGrid.innerHTML = ""

    numGridRows = 0;

    // Add first row
    addWordGridRow();
}

function updateNumberLetters() {
    console.log("Updating number of letters");

    wordLength = parseInt(document.getElementById('wordLength').value);

    resetGrid();

    updateResults();
}

function resetWordForm() {
    console.log("Reset form");

    resetGrid();

    updateResults();
}
