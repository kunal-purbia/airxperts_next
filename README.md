For Question 1 - Option 4 - After 5 seconds, 24 and 24

For Question 2 - Use API - /api/museum-visitor

Static Code for Question 2 is given below:

    function countVisits(input: string) {
      const initialCount = { M: 0, W: 0, C: 0 };

      for (const char of input) {
        if (initialCount.hasOwnProperty(char)) {
          initialCount[char]++;
        }
      }
      //   console.log("::::::::::", initialCount)

      // Sorting the object
      const sorted = Object.entries(initialCount)
        .filter(([_, value]) => value > 0)
        .sort((a, b) => {
          if (b[1] === a[1]) {
            const priority = { M: 1, W: 2, C: 3 };
            return priority[a[0]] - priority[b[0]];
          }
          return b[1] - a[1];
        });

      const finalString = sorted
        .map(([char, value]) => `${value}${char}`)
        .join("");

      return finalString;
    }

    const result = countVisits(input);
    console.log(result)

For Question 3 -
