// lib/searchAnimeByTags.ts
import { request, gql } from "graphql-request";

const endpoint = "https://graphql.anilist.co";

const query = gql`
  query ($genres: [String]) {
    Page(page: 1, perPage: 50) {
      media(
        genre_in: $genres
        type: ANIME
        sort: [SEARCH_MATCH, POPULARITY_DESC]
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        description(asHtml: false)
        siteUrl
        genres
      }
    }
  }
`;

export async function searchAnimeByTags(genres) {
  console.log("Searching:", genres);
  const variables = { genres };
  const data = await request(endpoint, query, variables);
  return data.Page.media;
}
