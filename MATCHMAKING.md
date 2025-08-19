Setup: 8 players

Players: P1, P2, P3, P4, P5, P6, P7, P8

Total rounds: 3

Round 1 → 4 matches (quarterfinals)

Round 2 → 2 matches (semifinals)

Round 3 → 1 match (final)

## Matches Table Sketch

| match_id | tournament_id | round_number | player1_id | player2_id | score1 | score2 | winner_id |
| -------- | ------------- | ------------ | ---------- | ---------- | ------ | ------ | --------- |
| 1	       | 1	           | 1	          | P1         | P2         | 11	 | 7	  | P1        |
| 2	       | 1	           | 1	          | P3	       | P4	        | 8	     | 10	  | P4        |
| 3	       | 1	           | 1	          | P5	       | P6	        | 12	 | 5	  | P5        |
| 4	       | 1	           | 1	          | P7	       | P8	        | 9	     | 14	  | P8        |
| 5	       | 1	           | 2	          | P1	       | P4	        | 13	 | 7	  | P1        |
| 6	       | 1	           | 2	          | P5	       | P8	        | 6	     | 11	  | P8        |
| 7	       | 1	           | 3	          | P1	       | P8	        | 15	 | 9	  | P1        |

## How this works

- **Round 1:** Quarterfinals

	+ 8 players, 4 matches.

- **Round 2:** Semifinals

	+ The 4 winners play.

- **Round 3:** Final

	+ The 2 winners face off, producing the champion.

- `winner_id` identifies who advances to the next round.

- `tournament_id` ties all these matches to the same tournament.


## Deriving the tournament winner

- Look at the **highest round_number** for that tournament (3 here).

- The `winner_id` of that match is the tournament winner.

- If you also store it in `tournaments.winner_id`, you avoid doing this query later.

With this design, we don’t need a `stages` column in `tournaments`, the `matches` table _is_ the bracket.


## Total number of rounds

In a single elimination tournament:

- Each round halves the number of players.

- So the total **number of rounds = log₂(number_of_players)**.

Example:

- 8 players: log₂(8) = 3 rounds (quarterfinals, semifinals, final).

- 16 players: log₂(16) = 4 rounds.

**This works only if the number of players is a power of 2.**


## Current round during the tournament

The **current round = total_rounds - rounds_remaining + 1**, \
or you can simply track it as you progress through the matches.

More practically:

- You don’t recalc with log₂ at runtime — you just look at the round_number of the matches being played.

- Example: if some matches with round_number = 2 are still unplayed, then the tournament is in round 2.


## If number_of_players is not a power of 2

Sometimes tournaments start with 6, 10, etc. players.

- Then some players get a bye (automatic advance) in round 1 to balance the bracket.

- The formula becomes more nuanced: total rounds = ⌈log₂(number_of_players)⌉.

---

# Logic

## 1. When the tournament is created

- Insert all the matches for **round 1** into the Matches table.

- If you want to prepare the whole bracket in advance (for 8 players, 7 matches total), you can create all matches at once with NULLs for players not yet known.

- Example: semifinals and final rows exist with player slots = NULL.

## 2. During round 1

- Each match is announced to the two players (via your app).

- When a game finishes, you update the `score1`, `score2`, and `winner_id`.

	```sql
		UPDATE Matches
		SET score1 = 15, score2 = 7, winner_id = P1
		WHERE match_id = 1;
	```

## 3. Generating next round pairings

After all matches in round 1 are completed, you create (or update) round 2 matches.

**Two possible strategies:**

- Pre-generate entire bracket:

	+ Insert round 2 and round 3 matches with NULL players at tournament creation.

	+ After each round, fill in the `player1_id` and `player2_id` with the winners from the previous round.

- Generate round by round:

	+ Insert only round 1 matches at the start.

	+ After round 1, insert round 2 matches.

	+ Continue until final.

Both work. The first one makes it easier to display the full bracket early, the second keeps the DB cleaner.

## Control logic (in pseudocode)

Here’s a very simple round loop for single elimination:

```js
let round = 1;
while (true) {
    let matches = getMatches(tournament_id, round);

    // Play each match in this round
    for (let match of matches) {
        announce(match);
        playMatch(match);  // waits until winner known
        saveResult(match);
    }

    // Collect winners
    let winners = matches.map(m => m.winner_id);

    if (winners.length === 1) {
        // Tournament complete
        updateTournamentWinner(tournament_id, winners[0]);
        break;
    }

    // Create next round
    createNextRoundMatches(tournament_id, round + 1, winners);

    round++;
}
```

- `getMatches`: query Matches for the current round.

- `announce`: notify players about their match.

- `playMatch`: handle the game logic (likely outside DB).

- `saveResult`: update scores and winner.

- `createNextRoundMatches`: pairs winners for the next round and inserts them.

## 5. Sorting players into pairs

Pairing winners is just splitting the winners list in twos:

```js
for (let i = 0; i < winners.length; i += 2) {
    createMatch(round+1, winners[i], winners[i+1]);
}
```