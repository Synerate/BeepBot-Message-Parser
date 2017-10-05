# Beepbot Message Parser

A simple message parser for making complex problems so simple.

[![npm version](https://badge.fury.io/js/beepbot-message-parser.svg)](https://badge.fury.io/js/beepbot-message-parser)
[![Build Status](https://travis-ci.org/ExoZoneDev/beepbot-message-parser.svg?branch=master)](https://travis-ci.org/ExoZoneDev/beepbot-message-parser)

# Introduction

Imagine you are creating a chatbot and you want to create a way for your users to create dynamic responses for messages. Like being able to get the current title on the platform
or even getting the current time in the streamers timezone. This can be a complex problem to solve but this module is here to help!

This is BMP or "BeepBot Message Parser" it allows you to give an input string which could contain args/methods which get converted to methods and new values replace them. Pretty neat huh?

# Usage
```typescript
import  { parser } from 'beepbot-message-parser';

async function run(channelMessage: IMessage, channelSettings: any, input: string) {
    return await parser(channelMessage: IMessage, channelSettings: any, input: string);
}

run(channelMessage, channelSettings, input)
    .then(res => console.log(res))
    .catch(err => console.error(err));
```

# Example Inputs
```typescript
// Get the current user.
let input = 'I am {user}' // I am TestUser

// Get the current title from Mixer.
let input = 'Streaming: {mixer name}' // Streaming: Overwatch Derping

// Get the current song that a user is scrobbling.
let input = 'Now Playing: {lastfm artdude543}' // Now Playing: Hunter by Galantis
```

# Supported Methods

TODO.

# Limitations

Currently, if you wish to use this in your own applications. You need to follow the spec for the `channelMessage` and `channelSetting` inputs.
In time we will update it to allow injecting our own input methods to make it more universal.

But both inputs have full [Typings](https://github.com/ExoZoneDev/beepbot-message-parser/tree/master/src/interface), so you can mock them if you wish.
