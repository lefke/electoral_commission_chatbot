import { env } from "@/config/env.mjs";
const getMatchesFromEmbeddings = async (embeddings, pinecone, topK) => {
    if (!env.PINECONE_INDEX_NAME) {
        throw (new Error("PINECONE_INDEX_NAME is not set"));
    }
    const index = pinecone.Index(env.PINECONE_INDEX_NAME);
    const queryRequest = {
        vector: embeddings,
        topK,
        includeMetadata: true,
    };
    try {
        const queryResult = await index.query({
            queryRequest,
        });
        return queryResult.matches?.map((match) => ({
            ...match,
            metadata: match.metadata,
        })) || [];
    }
    catch (e) {
        console.log("Error querying embeddings: ", e);
        throw (new Error(`Error querying embeddings: ${e}`));
    }
};
export { getMatchesFromEmbeddings };
