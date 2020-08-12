import gql from 'graphql-tag';

/*
 ****************************************************************
 *****************    APOLLO SERVER QUERIES   *******************
 ****************************************************************
 */

// GET  RECOMMENDED MEMBERS
export const GET_RECOMMENDED_MEMBERS = gql`
  query recommendedMembers {
    recommendedMembers {
      id
      email
      firstName
      lastName
      phoneNumber
      currentLocation {
        id
        country
        state
      }
    }
  }
`;

// GET  RECOMMENDED COMMUNITIES
export const GET_RECOMMENDED_COMMUNITIES = gql`
  query nearbyMembers {
    nearbyMembers {
      id
      email
      firstName
      lastName
      phoneNumber
      currentLocation {
        id
        country
        state
      }
    }
  }
`;

// GET  NEARBY MEMBERS
export const GET_NEARBY_MEMBERS = gql`
  query recommendedCommunities {
    recommendedCommunities {
      id
      avatar
      name
    }
  }
`;
