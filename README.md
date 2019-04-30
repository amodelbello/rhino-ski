# Ceros Ski Code Challenge

Here is my implementation of the rhino ski game. I used react + typescript to build out a somewhat complete game with timer and scoring. Thank you for your consideration and I hope you like it!

---

## Comments on the original version

Although I would definitely give it points for brevity, if I were to review this code I would point out the following issues:

- Everything is in same scope on the same level
- No encapsulation of functionality
- ES5 (jquery promises?)
- config is mixed in with logic and used as bare strings
- `placeNewObstacle(direction)` is called in several places due to the changing `direction` parameter but really should only be called once inside the loop
- no consistency - sometimes direct ctx methods are called, sometimes there's a function that just calls the ctx method

#### The bug:

This is caused by the way changing direction is implemented. The direction variable (number) is incremented or decremented based on which arrow is pressed. Since the left arrow always decrements the number, if the number is 0 then we end up with a direction variable with a value of -1. Since this is not a valid direction the game crashes.

This issue could be fixed with something like this:

```
if (skierDirection === 1) {
  skierMapX -= skierSpeed;
  placeNewObstacle(skierDirection);
} else if (skierDirection === 0) {
  skierDirection = 1;
} else {
  skierDirection--;
}
```

It's worth pointing out that there is also an issue when skierDirection is 5 and incremented to 6. A solution similar to the one above can be used to fix that as well.

---

## New features added to this version

This implementation strives to separate logic from presentation. The logic for running the game can be found in the `./src/lib` directory. I use `./src/types` to keep typescript interfaces and enums. `./src/components/` contains most of the React code.

Additional features this version contains include:

- Time limit
- Jumps
- Scoring based on jumps
- High score stored in local storage
- Inevitable death by rhino
- Speed boost
- Pausing
- Info modal
- Production build deployed to heroku at [https://adb-rhino-ski.herokuapp.com/][https://adb-rhino-ski.herokuapp.com/]

Conspicuously absent are tests. I feel a bit hypocritical for this because I'm constantly advocating for the necessitiy of well tested code but I need to get back to my dayjob ;). If tests are something you definitely need to see I can buid out a few tests. Let me know.

---

## Available Scripts

In the project directory, you can run:

### `npm dev`

Runs the app in the development mode on [http://localhost:3000](http://localhost:3000)

### `npm run build && npm start`

Build and run the project in production mode on [http://localhost:8080](http://localhost:8080)

### `npm test`

Run tests (there are no tests yet)
