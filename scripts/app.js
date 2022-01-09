var wordLength = 5

function updateNumberLetters()
{
    console.log("Updating number of letters")

    var knownLettersForm = document.getElementById("knownLettersForm");
    knownLettersForm.innerHTML = ""

    wordLength = parseInt(document.getElementById('wordLength').value);

    for (let i = 0; i < wordLength; i++) {
        knownLettersForm.innerHTML += '<input type="text" name="knownLetter' + i + '" id="knownLetter' + i + '" value="" style="width: 20px;">'
    }
}


function updateResults()
{
    console.log("Trying to read word list...")
    var req = new XMLHttpRequest();
    req.onload = function(){
        console.log("Got response")

        var words = this.responseText.split("\n")
        words = words.map(s => s.trim());
        
        console.log("Originally found " + words.length + " words")
        
        var outputTable = document.getElementById("outputTable");
        outputTable.innerHTML = ""

        let wordLength = parseInt(document.getElementById('wordLength').value);
        let disallowedLetters = document.getElementById('disallowedLetters').value;
        let requiredLetters = document.getElementById('requiredLetters').value;

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
                if ((document.getElementById('knownLetter' + i).value.length > 0) && word[i][0] != document.getElementById('knownLetter' + i).value)
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

        console.log("Number of " + wordLength + "-letter words: " + filteredWords.length + " words")
        document.getElementById("numResultsHeading").innerHTML = filteredWords.length + " Possible Results"

        // Display filtered results
        filteredWords.forEach(function(word) {
            let row = document.createElement('tr');
            row.innerHTML = word;
            outputTable.appendChild(row);
        });
    }
    req.open('GET', './wordlist.txt');
    req.send();
}
