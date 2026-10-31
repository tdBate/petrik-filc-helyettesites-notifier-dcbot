## Filc discord notifier
Simple discord bot which listens to filc.petrik.hu and notifies when a selected class has impacted substitution news.

> ⚠️ **Warning:** *petrik filc's data structure was higly unstable not so long ago, only trust the bot to an extent*

## Usage: using the bot 
1. ask me for a bot invite link
2. add the bot to your discord server
3. go to your preferred text channel on your server and:
    1. selects the current channel as output:
    ```/set-output-channel```
    2. set your class: ```/set-class class:13.e``` _or_ ```/set-class class:all``` _if you want to listen to every class's notification_
    

## Usage: hosting the bot
> ⚠️ **Warning:** *first run the server before adding it to a discord channel*
1. clone the repo
2. in the project root folder ``` npm run setup ```
3. create a .env file and add session tokens in it
    ```
    DISCORD_TOKEN= (insert discord bot token)
    APPLICATION_ID= (insert discord bot application id)
    SESSION_TOKEN= (insert the session token from filc.petrik.hu cookies)
    ```
4. ``` npm run server ```
5. after that add to the server go see usage