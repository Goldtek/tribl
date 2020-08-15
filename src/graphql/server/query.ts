import gql from 'graphql-tag';

/*
 ****************************************************************
 *****************    APOLLO SERVER QUERIES   *******************
 ****************************************************************
 */

// GET  RECOMMENDED MEMBERS
export const GET_RECOMMENDED_MEMBERS = gql`
  query RecommendedMembers {
    recommendedMembers {
      email
      firstName
      lastName
      phoneNumber
      currentLocation {
        id
        country
        state
      }
      identity {
        name
      }
      interest {
        name
      }
      birthPlace {
        id
      }
      connected
    }
  }
`;

// GET  NEARBY MEMBERS
export const GET_NEARBY_MEMBERS = gql`
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

// GET  RECOMMENDED COMMUNITIES
export const GET_RECOMMENDED_COMMUNITIES = gql`
  query recommendedCommunities {
    recommendedCommunities {
      id
      avatar
      name
    }
  }
`;

//GET POPULAR COMMUNITIES
export const GET_POPULAR_COMMUNITIES = gql`
  query popularCommunities {
    popularCommunities {
      id
      name
      membersCount
      description
      avatar
      interests {
        id
        name
      }
      channels {
        id
        name
      }
      participants {
        id
        connected
        firstName
        lastName
        phoneNumber
      }
    }
  }
`;
