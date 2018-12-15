# Create Custom Skill

Create Alexa Custom Skills.

## Overview

With this template you can use all serverless framework available tools. A basic project is available for deployment. The deploy hook scripts will take over and use serverless to deploy the AWS part of the skill. The rest is kept as much as possible aligned with the default behaviour of the ask cli tool.

## Aha. Now I want to debug my skill.

Good. If you are using Visual Studio code, you can just open debug tab and start the debug configuration `debug with bst proxy`. See [bst proxy](http://docs.bespoken.io/en/latest/commands/proxy/) for details.

You can also start debug session with `npm start debug`.

## Wow. But my skill requires so many sample utterances. Can this tool help me?

Of course. Use intents.yml file to _describe_ the grammar for the sample utterances. Use types.yml to list the types you want to use.

Example:
`(recipe|receipes) for (|a|an) {Item}` will expand to:

```
recipe for {Item}
receipes for {Item}
recipe for a {Item}
receipes for a {Item}
recipe for an {Item}
receipes for an {Item}
```

The default `ask deploy` will build the model for you. You can also build the model by running which has the following usage:

```
Usage: alexa-language-model-generator [options]

Options:
  -V, --version            output the version number
  -i, --invocation <name>  Invocation name
  -l, --locales [locales]  Specific Locales seperated by comma (default all) (default: "de-DE,en-AU,en-CA,en-GB,en-IN,en-US,es-ES,es-MX,fr-FR,ja-JP")
  -n, --intents [path]     Intent file path where all intents are defined (default intents.yml) (default:"intents.yml")
  -t, --types [path]       Intent file path where all types are defined (default types.yml) (default: "types.yml")
  -m, --models [path]      Path to the folder where model json files should be stored (default model) (default: "models")
  -h, --help               output usage information
```
