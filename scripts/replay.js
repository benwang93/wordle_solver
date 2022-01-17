function filterWords() {
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

// Functions to support replay feature
function updateReplay() {
    console.log("Trying to read word list...");
    var req = new XMLHttpRequest();
    req.onload = function () {
        console.log("Got response");
        // document.getElementById("numResultsHeading").innerHTML = "Heard-ling the word-lings...";

        var words = preprocessGetRequestResults(this.responseText);

        // Grab solution
        var solutionWord = document.getElementById('solutionWord').value.toLowerCase();
        wordLength = solutionWord.length;

        // Make sure solution is in dictionary
        if (!words.includes(solutionWord)) {
            document.getElementById("infoParagraph").innerHTML = "ERROR: Word not found in dictionary!";
            return;
        }

        // Start with initial guesses and play weeder words until < 10? possible words

        console.log("TODO: Run replay here");
    }
    req.open('GET', './wordlist.txt');
    req.send();
}