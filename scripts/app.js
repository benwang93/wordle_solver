console.log("Trying to read word list...")
var req = new XMLHttpRequest();
req.onload = function(){
    // process_webgl_data(this.responseText);
    console.log("Got response")

    let text = this.responseText;

    var words = text.split("\n")
    words = words.map(s => s.trim());
    // console.log(words)
    console.log("Originally found " + words.length + " words")
    
    var demo = document.getElementById("outputTable");
    
    // Create an empty <tr> element and add it to the 1st position of the table:
    // var row = tableHP.insertRow(tableHP.rows.length);

    const filteredWords = words.filter(wordsOfLength);

    function wordsOfLength(word) {
        return word.length == 5;
    }

    console.log("Number of 5-letter words: " + filteredWords.length + " words")


    filteredWords.forEach(function(word) {
        // demo.innerHTML += word + "|"
        // console.log(word)

        let row = document.createElement('tr');
        row.innerHTML = word;
        demo.appendChild(row);
    });
}
req.open('GET', './wordlist.txt');
req.send();