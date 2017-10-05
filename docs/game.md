# !game

!game is a stupid gambling game for the bot. Use the following commands to play and manage your credits. Note that most commands will not give a response in #general, please restrict it to [#bot_spam](https://discord.gg/USktR6m).

**Credits** are a fake currency used only for CharredBot. They are literally worthless, except the person with the most credits is clearly better than the scrubs below them. Credits are always whole values and are rounded down if you 

Please keep in mind that !game is just for fun. It is **not** an accurate simulation of gambling. CharredBot is rigged so you have a very slight profit. Gambling such as CS:GO coinflip and roulette are NEVER in the users' favor.

Thanks to @trash can for helping with the first draft of instructions.

## help

`!game help` returns this page and is the only `!game` command that works outside of #general.

## balance

`!game balance` will show you your current balance.

### balance [@user]

`!game balance @user`, where `@user` is a Discord mention of the target user, gives the current balance of the target. It is equivalent to the targeted user using `!game balance`.

![game balance](https://i.imgur.com/41UO9Q2.png)

## free

`!game free` gives you free credits! You must be below a certain threshold to get the free credits. You will be given a random amount of credits. The "Loot Table" of the free credits is shown below:

credits | chance
--|--
10|25%
15|25%
20|25%
40|25%
80|25%
160|25%

## give \[@user] \[credits]

`!game give [@user] [credits]`, where `@user` is a Discord mention of the target user and credits is a number, will send that many credits to the target.

![game give](https://i.imgur.com/j9tTxfS.png)

#Games

##coinflip [credits]

`!game coinflip [credits]`, where credits is a number, will coinflip that amount of credits. You will randomly either lose that many credits or gain that many credits.

##blackjack [credits]

`!game blackjack [credits]`, where credits is a number, will start a game of blackjack and bet that amount of credits. The credits are immediately removed from your balance.

`!game hit` tells the dealer to deal you one more card.

`!game stand` will stand (ending the game).

Blackjack payouts vary depending on your win. Below is the amount of credits you will receive for each ending scenario.

Scenario | Payout
--|--
Loss | 0
Push (draw) | 1 * inital bet (breaks even)
Win | 2.2 * initial bet
Win with Blackjack | 3.3 * initial bet