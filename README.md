# Solver for Wordle-like puzzles

Rules to support:

- Letter in specific location
- Must contain at least 1 instance of certain letters
- Does not contain certain letters
- Word length

Steps:

1. Filter to words of expected length
2. Match hard rules (x letter in y position)
3. Remove words containing illegal letters
4. Remove words not containing at least 1 instance of each required letter

References:

- [Wordle](https://www.powerlanguage.co.uk/wordle/)
- [Word list](http://www-personal.umich.edu/~jlawler/wordlist)
- [Wordle-like game with variable length](http://foldr.moe/hello-wordl/)