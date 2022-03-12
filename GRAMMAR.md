# Grammar Module Documentation

The grammar module is a recursive dictionary lookup system that parses a template sentence into symbols and evaluates any tokens it comes across until the sentence is complete (no further tokens detected).

# Dictionary

A set of keys where each key has either a template or a list assigned to it.

# Templates

Templates are sentences containing tokens that refer to a list in the dictionary.

# Lists

Lists of words or sentence fragments that are assigned to a key in the dictionary.

# Tokens

Tokens a syntax for making reference to a key in the dictionary list, and if specified run an operation on the returned text before adding it to the completed sentence.

## Token Syntax

Tokens begin and end with a square bracket and the first character after the opening bracket directs how the algorithm should look up the token in the dictionary.

### Select List Item

Randomly selects one of the items in a list of words or templates matching the token parameter.

```
// Dictionary Values:
grammar.set('Strong Adverbs', ['overwhelmingly', 'unbelievably', 'unbearably', 'incredibly'])

// Evaluate Sentence
console.log(grammar.text(`The light is [*Strong Adverbs] bright.`))

/** Results
    The light is unbearably bright.
    The light is overwhelmingly bright.
    The light is incredibly bright.
*/
```

## Planned Token Syntax (Not Yet Implemented)

### Conditional Text

Only return a result from the referenced list or template if the condition is true.

Syntax would be something like `[?(context variable)(comparison)(value):(token if true):(token if false)]`, where (context variable) is something available to the grammar module from other modules in the mudnude library like the day of the year, what season it is, etc.  (comparison) is something like > < or =, and (value) is the amount or string we're comparing the context variable to.

This way different lists could be provided based on environmental or seasonal conditions.