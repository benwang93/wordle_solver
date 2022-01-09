
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

        
        var filteredWords = words.filter(wordsOfLength);
        filteredWords = filteredWords.filter(wordsWithoutLetters);

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
