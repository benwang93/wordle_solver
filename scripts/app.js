
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
        
        const filteredWords = words.filter(wordsOfLength);

        let wordLength = parseInt(document.getElementById('wordLength').value);

        function wordsOfLength(word) {
            let wordLength = parseInt(document.getElementById('wordLength').value);
            return word.length == wordLength;
        }

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
