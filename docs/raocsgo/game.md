# !game

!game is a stupid gambling game for the bot. Use the following commands to play and manage your credits. Note that most commands will not give a response in #general, please restrict it to [#bot_spam](https://discord.gg/USktR6m).

**Credits** are a fake currency used only for CharredBot. They are literally worthless, except the person with the most credits is clearly better than the scrubs below them. Credits are always whole values and are rounded down.

Please keep in mind that !game is just for fun. It is **not** an accurate simulation of gambling. CharredBot is rigged so you have a very slight profit. Gambling such as CS:GO coinflip and roulette are NEVER in the users' favor.

**Found a bug?** [Report it here!](https://github.com/charredgrass/raocsgo-discord-bot/issues/new)

Thanks to trash can for helping with the first draft of instructions, and mgrev for being the unknowing test subject.

## help

`!game help` returns this page and is the only `!game` command that works outside of #general.

## balance

`!game balance` will show you your current balance.

### balance [@user]

`!game balance @user`, where `@user` is a Discord mention of the target user, gives the current balance of the target. It is equivalent to the targeted user using `!game balance`.

![game balance](https://i.imgur.com/41UO9Q2.png)

## leaderboard

`!game leaderboard` display the 5 players with the highest balances. 

## free

`!game free` gives you free credits! You must be below a certain threshold to get the free credits. You will be given a random amount of credits. The "Loot Table" of the free credits is shown below:

credits | chance
--|--
10|25%
15|25%
20|25%
40|12.5%
80|6.25%
160|6.25%

## give \[@user] \[credits]

`!game give [@user] [credits]`, where `@user` is a Discord mention of the target user and credits is a number, will send that many credits to the target.

![game give](https://i.imgur.com/j9tTxfS.png)

# Games

## coinflip [credits]

`!game coinflip [credits]`, where credits is a number, will coinflip that amount of credits. You will randomly either lose that many credits or gain that many credits.

## blackjack [credits]

`!game blackjack [credits]`, where credits is a number, will start a game of blackjack and bet that amount of credits. The credits are immediately removed from your balance.

`!game hit` tells the dealer to deal you one more card.

`!game stand` will stand (ending the game).

Blackjack payouts vary depending on your win. Below is the amount of credits you will receive for each ending scenario.

Scenario | Payout
--|--
Loss | 0
Push (draw) | 1 * inital bet (breaks even)
Win | 2.5 * initial bet
Win with Blackjack | 3.5 * initial bet

## slots [credits]

`!game slots [credits]`, where credits is a number, will spend that many credits and pull a slot machine.

The payout is determined by the 3 icons in the middle row of the display. Icons divided into 3 tiers:

![slots tiers](https://i.imgur.com/XYIoCA5.png)

Based on the combinations of the icons, you will receive one of these payouts. If multiple combinations occur, the machine gives you the highest applicable payout possible. The payout listed is a multiplier, the actual amount paid is your initial bet * payout multiplier, rounded down to the nearest whole credit.

Combination | Payout | Probability (%)
--|--|--
None | 0 | 54.45
3 of any Tier 1 | 1.3 | 06.99
3 of any Tier 2 | 5 | 00.88
2 of any Tier 3 | 1 | 07.22
3 of any Tier 3 | 8 | 00.88
2 matching Tier 1 | 2 | 21.00
3 matching Tier 1 | 14 | 01.17
2 matching Tier 2 | 3 | 03.61
3 matching Tier 2 | 69 | 00.11
2 matching Tier 3 | 7 | 03.60
3 matching Tier 3 | 70 | 00.11

\* *probabilities based on simulation of 10 million trials rounded to nearest hundredth of a percent*
