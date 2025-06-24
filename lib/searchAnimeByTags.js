// lib/searchAnimeByTags.ts
import { request, gql } from "graphql-request";

const endpoint = "https://graphql.anilist.co";

export async function searchAnimeByGenre(genres) {
  const variables = { genres };
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
  const data = await request(endpoint, query, variables);

  return data.Page.media;
}

export async function searchAnimeByTags(tags) {
  const variables = { tags };
  const query = gql`
    query ($tags: [String]) {
      Page(page: 1, perPage: 50) {
        media(
          tag_in: $tags
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
  const data = await request(endpoint, query, variables);

  return data.Page.media;
}
