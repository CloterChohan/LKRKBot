# LKRKBot Setup

Clone the repository first

1. Open CMD by using ``Windows + R`` then type ``cmd``

2. Run this command ``cd [The location of cloned repo]`` (without the '[]')

3. Then make sure to run which partition is the cloned repo, for example if the location of cloned repo is at C:\... then run ``C:``, and so with D:\... ``D:`` and so on.

4. Run this command in order 
    - ``npm install``
    - ``npm install discord.js``
    - ``npm install node-trello``
    - ``npm i google-spreadsheet --save``
    - ``npm install -g typescript``

5. Create new file with name "auth.json" with this inside
```json
{
	"token": ""
}
```
Make sure to write the bot-token inside the "", example: ``"token": "0000000000000000000000000000000"``.

!To get the token, visit https://discord.com/developers and choose the bot you want to create, and then go to bot > copy token
