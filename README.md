# MudNode

MudNode is an experimental MUD system written in NodeJS and played in your browser with WebSockets.

## Installation

You need to have NodeJS installed on your system, then from a command prompt inside the folder you extracted this repository to run `npm install`.

It will automatically download and install any NPM packages required to run MudNode.

## Running MudNode

Once NPM package dependencies are installed, you can run it with `node index.js`.  This will start the server back-end and also serve the front-end client on localhost:8080.  Direct your browser to http://localhost:8080/ and register your username to begin.

## Grammar Processor

Dynamic description templates can be created through the grammar module, and running the text() method with a template will process all the tokens (denoted with the [* and ] characters) and return a generated sentence.

```
/**
 * Example of the grammar processor.
 */
grammar.set('Greeting', '[*Hello], [*friend].')
grammar.set('Hello', ['Greetings', 'Hello', 'Hi', '[*Extended Hello]'])
grammar.set('friend', ['buddy', 'friend', 'pal'])
grammar.set('Extended Hello', [`Such a pleasure to make your acquaintance`, `I'm delighted to meet you`])
console.log(grammar.text('[*Greeting]'))
```

The above code will produce output sentences like this:

```
I'm delighted to meet you, pal.
Greetings, pal.
Hello, friend.
Hi, buddy.
Hi, friend.
Such a pleasure to make your acquaintance, pal.
```

A more detailed documentation of the grammar module is [available here](GRAMMAR.md).

## Discord Server

https://discord.gg/EHtHGnGjtJ