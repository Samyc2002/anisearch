import { request, gql } from "graphql-request";

const endpoint = "https://graphql.anilist.co";

export async function fetchGenres() {
  const query = gql`
    query {
      GenreCollection
    }
  `;

  try {
    const { GenreCollection } = await request(endpoint, query);
    return GenreCollection; // This is an array of genre strings
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}
