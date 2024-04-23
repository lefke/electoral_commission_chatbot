import { OpenAIEmbeddings } from "@langchain/openai";
import initPinecone from "@/utils/pinecone-client";
import { getMatchesFromEmbeddings } from "@/utils/matches";
async function fetchAndLogPineconeMatches(query) {
    // Initialize the OpenAI Embeddings with your model of choice
    const embedder = new OpenAIEmbeddings({
        model: "text-embedding-3-small", // Adjust the model as needed
    });
    // Embed the query
    const embeddings = await embedder.embedQuery(query);
    // Initialize Pinecone
    const pinecone = await initPinecone();
    // Fetch matches from Pinecone
    const matches = await getMatchesFromEmbeddings(embeddings, pinecone, 3);
    // Log the matches
    console.log("Matches from Pinecone:", matches);
}
// Example usage
const exampleQuery = "How much can a candidate spend during the regulated period for the police and crime commissioner election in North Wales?";
fetchAndLogPineconeMatches(exampleQuery)
    .then(() => console.log("Fetching matches completed."))
    .catch((error) => console.error("Error fetching matches:", error));
