const express = require("express");
const verification = express.Router();
const openai = require("openai");

verification.post("/verify", async (req, res) => {
  console.log("req.body", req.body);
  const description = req.body.description;
  const codeToVerify = req.body.code;
  // Set up your OpenAI API key
  openai.api_key = "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";

  // Set up the endpoint URL
  const endpoint = "https://api.openai.com/v1/engines/codex/completions";

  async function verifyCode(description, codeToVerify) {
    // Set the prompt and parameters for the API request
    const prompt = `Verify the following code: ${description}\n\nCode:\n${codeToVerify}`;
    const parameters = {
      prompt: prompt,
      max_tokens: 64,
      n: 1,
      stop: "\n",
    };

    // Send the API request and get the response
    const response = await openai.Completion.complete({
      engine: "davinci-codex",
      ...parameters,
    });
    const generatedCode = response.choices[0].text.trim();

    // Calculate the percentage of each sentence in the description that is fulfilled
    const descriptionSentences = description.split(".").map((s) => s.trim());
    const generatedCodeSentences = generatedCode
      .split(".")
      .map((s) => s.trim());

    const fulfillmentPercentages = [];
    for (let i = 0; i < descriptionSentences.length; i++) {
      const sentence = descriptionSentences[i];
      const sentenceWords = sentence.toLowerCase().split(" ");
      const sentenceFulfilledWords = sentenceWords.filter((word) =>
        generatedCode.toLowerCase().includes(word)
      );
      const sentenceFulfillmentPercentage =
        (sentenceFulfilledWords.length / sentenceWords.length) * 100;
      fulfillmentPercentages.push(sentenceFulfillmentPercentage);
    }

    // Generate a list of strings that indicate which parts of each sentence in the description are fulfilled and which are not
    const fulfillmentStrings = [];
    for (let i = 0; i < descriptionSentences.length; i++) {
      const sentence = descriptionSentences[i];
      const sentenceWords = sentence.split(" ");
      const fulfilledWords = sentenceWords.filter((word) =>
        generatedCode.includes(word)
      );
      if (fulfillmentPercentages[i] === 100) {
        fulfillmentStrings.push(`${sentence}: Fulfilled`);
      } else if (fulfillmentPercentages[i] === 0) {
        fulfillmentStrings.push(`${sentence}: Not fulfilled`);
      } else {
        fulfillmentStrings.push(
          `${sentence}: Partially fulfilled (${fulfillmentPercentages[
            i
          ].toFixed(2)}%)`
        );
      }
    }

    // Return the fulfillment percentages and the fulfillment strings as an object
    return {
      fulfillmentPercentages: fulfillmentPercentages,
      fulfillmentStrings: fulfillmentStrings,
    };
  }

  verifyCode(description, codeToVerify)
    .then((result) => {
      console.log("Code verification results:");
      for (let i = 0; i < result.fulfillmentStrings.length; i++) {
        console.log(`Sentence ${i + 1}: ${result.fulfillmentStrings[i]}`);
      }
      res.send(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

// // Example usage
// const description = "Write a function that takes a list of integers and returns the sum of all even numbers in the list. If the list is empty, the function should return 0.";
// const codeToVerify = `
// function sumOfEvens(lst) {
//     if (lst.length === 0) {
//         return 0;
//     }
//     return lst.filter(x => x % 2 === 0).reduce((sum, x) => sum + x);
// }
// `;

module.exports = verification;
