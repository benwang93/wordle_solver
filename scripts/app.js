var wordLength = 5

function initLetterCounts()
{
    var map = {}
    for (let i = 0; i < 26; i++)
    {
        map[String.fromCharCode(i + 97)] = 0
    }
    return map;
}

function debugLogCharCounts(charCounts)
{
    for (let i = 0; i < 26; i++)
    {
        console.log("Count " + String.fromCharCode(i + 97) + ": " + charCounts[String.fromCharCode(i + 97)])
    }
}

function updateResults()
{
    console.log("Trying to read word list...")
    var req = new XMLHttpRequest();
    req.onload = function(){
        console.log("Got response")
        document.getElementById("numResultsHeading").innerHTML = "Heard-ling the word-lings..."

        var words = this.responseText.split("\n")
        words = words.map(s => s.trim());
        
        console.log("Originally found " + words.length + " words")
        
        var outputTable = document.getElementById("outputTable");
        outputTable.innerHTML = ""

        // let wordLength = parseInt(document.getElementById('wordLength').value);
        let disallowedLetters = document.getElementById('disallowedLetters').value.toLowerCase();
        let requiredLetters = document.getElementById('requiredLetters').value.toLowerCase();

        function wordsOfLength(word) {
            return word.length == wordLength;
        }

        function wordsWithoutLetters(word) {
            for (let c of disallowedLetters) {
                if (word.includes(c))
                {
                    return false;
                }
            }

            return true;
        }

        function wordsWithLetters(word) {
            for (let c of requiredLetters) {
                if (!word.includes(c))
                {
                    return false;
                }
            }

            return true;
        }

        function filterKnownLettterPositions(word) {
            for (let i = 0; i < wordLength; i++)
            {
                if ((document.getElementById('knownLetter' + i).value.length > 0) && word[i] != document.getElementById('knownLetter' + i).value.toLowerCase()[0])
                {
                    return false;
                }
            }

            return true;
        }

        function filterIncorrectGuesses(word) {
            for (let i = 0; i < wordLength; i++)
            {
                let incorrectGuesses = document.getElementById('wrongLetter' + i).value.toLowerCase();
                
                if (incorrectGuesses.includes(word[i]))
                {
                    return false;
                }
            }

            return true;
        }
        
        var filteredWords = words.filter(wordsOfLength);
        filteredWords = filteredWords.filter(wordsWithoutLetters);
        filteredWords = filteredWords.filter(wordsWithLetters);
        filteredWords = filteredWords.filter(filterKnownLettterPositions);
        filteredWords = filteredWords.filter(filterIncorrectGuesses);

        console.log("Number of " + wordLength + "-letter words: " + filteredWords.length + " words")
        document.getElementById("numResultsHeading").innerHTML = filteredWords.length + " Possible Results"

        // Now score remaining words
        // Start by gathering stats on occurrence of letters
        var charCounts = initLetterCounts();
        // debugLogCharCounts(charCounts)

        for (let word of filteredWords)
        {
            for (let c of word)
            {
                charCounts[c]++;
            }
        }

        debugLogCharCounts(charCounts);

        // Calculate score for each word
        var wordScores = [];
        for (let word of filteredWords)
        {
            var wordScore = 0;
            var countedLetters = [];

            for (let c of word)
            {
                if (!countedLetters.includes(c))
                {
                    wordScore += charCounts[c];
                    countedLetters.push(c);
                }
            }

            wordScores.push({
                word: word,
                score: wordScore
            })
        }


        // Sort word list by score
        // TODO: Make this filter selectable (score up/down, alphabetical up/down)
        wordScores.sort((a, b) => {
            // Sort descending order by score
            return b.score - a.score;
        });

        // Create table header
        let headerRow = document.createElement('tr');
        let wordCol = document.createElement('td');
        let scoreCol = document.createElement('td');
        wordCol.innerHTML = "<b>Word</b>";
        scoreCol.innerHTML = "<b>Score</b>";
        headerRow.appendChild(wordCol);
        headerRow.appendChild(scoreCol);
        outputTable.appendChild(headerRow);

        // Display filtered results
        wordScores.forEach(function(word) {
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
    req.open('GET', './wordlist.txt');
    req.send();
}

function updateNumberLetters()
{
    console.log("Updating number of letters")

    var knownLettersForm = document.getElementById("knownLettersForm");
    knownLettersForm.innerHTML = ""

    wordLength = parseInt(document.getElementById('wordLength').value);

    // Create table for entering good and bad letters
    let correctRow = document.createElement('tr');
    let incorrectRow = document.createElement('tr');

    // Add row headings
    let correctColHeader = document.createElement('td');
    let incorrectColHeader = document.createElement('td');
    correctColHeader.innerHTML = "<b>Correct letter</b>";
    incorrectColHeader.innerHTML = "<b>Incorrect guesses</b><br>(Exclude these letters in these positions)";
    correctRow.appendChild(correctColHeader);
    incorrectRow.appendChild(incorrectColHeader);

    for (let i = 0; i < wordLength; i++) {
        let correctCol = document.createElement('td');
        let incorrectCol = document.createElement('td');
        correctCol.innerHTML += '<input type="text" name="knownLetter' + i + '" id="knownLetter' + i + '" value="" style="width: 20px;">';
        incorrectCol.innerHTML += '<input type="text" name="wrongLetter' + i + '" id="wrongLetter' + i + '" value="" style="width: 80px;">';
        correctRow.appendChild(correctCol);
        incorrectRow.appendChild(incorrectCol);
    }
    knownLettersForm.appendChild(correctRow);
    knownLettersForm.appendChild(incorrectRow);

    updateResults()
}
