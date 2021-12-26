# LKRKBot Setup

1. Clone the repository first

2. Install node js with using this link https://nodejs.org/en/download/

3. Open CMD by using ``Windows + R`` then type ``cmd``

4. Make sure to run the command ``node -v`` in CMD to make sure that your node js is installed

5. Run this command ``cd [The location of cloned repo]`` in the CMD (without the '[]')

6. Then make sure to run which partition is the cloned repo, for example if the location of cloned repo is at C:\... then run ``C:``, and so with D:\... ``D:`` and so on.

7. Run this command in order 
    - ``npm install``
    - ``npm install discord.js``
    - ``npm install node-trello``
    - ``npm i google-spreadsheet --save``
    - ``npm install -g typescript``
    - ``npm install node-schedule``

8. Create new file with name "auth.json" with this inside
```json
{
    "token": "",
    "clientId" : "",
    "guildId" : "",
    "announcementChId" : ""
}
```
Make sure to write the bot-token inside the "", example: 
```json
    "token": "0000000000000000000000000000000",
    "clientId" : "xxxxxxxxxxxxxxxxx",
    "guildId" : "xxxxxxxxxxxxxxxxxxxx",
    "announcementChId" : "xxxxxxxxxxxxxxxxx"
```

!To get the token, visit https://discord.com/developers and choose the bot you want to create, and then go to bot > copy token
