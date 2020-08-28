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
      avatar
      connectionCount
      communityCount
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
      connected
      avatar
      communityCount
      connectionCount
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
      membersCount
      isMember
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
      isMember
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
      membersCount
    }
  }
`;

//GET MY COMMUNITIES
export const GET_MY_COMMUNITIES = gql`
  query myCommunities {
    myCommunities {
      id
      description
      avatar
      channels {
        id
        name
      }
      membersCount
      interests {
        id
        name
      }
      participants {
        id
        firstName
        lastName
        phoneNumber
        avatar
        currentLocation {
          id
          country
          state
        }
      }
    }
  }
`;

//GET MY CONNECTIONS
export const GET_MY_CONNECTIONS = gql`
  query myConnections {
    myConnections {
      firstName
      lastName
      id
      phoneNumber
    }
  }
`;

//GET MY CONNECTION REQUESTS
export const GET_CONNECTION_REQUEST = gql`
  query connectionRequests {
    connectionRequests {
      firstName
      lastName
      phoneNumber
      connected
    }
  }
`;

//GET ONE COMMUNITY
export const GET_SINGLE_COMMUNITY = gql`
  query community($id: ID!) {
    Community(id: $id) {
      description
      id
      avatar
      description
      interests {
        id
        name
      }
      membersCount
      isMember
      name
    }
  }
`;

//GET ONE PASSPORT
export const GET_SINGLE_PASSPORT = gql`
  query singlePassport($id: String) {
    singlePassport(id: $id) {
      id
      email
      firstName
      lastName
      phoneNumber
      connected
      avatar
      communityCount
      connectionCount
      currentLocation {
        id
        country
        state
      }
      identity {
        id
        name
      }
      interest {
        id
        name
      }
      birthPlace {
        id
        state
        country
      }
    }
  }
`;

//GET CHENNELS OF A COMMUNITY
export const GET_COMMUNITY_CHANNELS = gql`
  query communityChannels($id: ID!) {
    communityChannels(communityId: $id) {
      name
    }
  }
`;

//GET PARTICIPANTS OF A COMMUNITY
export const GET_COMMUNITY_MEMBERS = gql`
  query communityMemberscommunityChannels($id: ID!) {
    communityMembers(communityId: $id) {
      id
      firstName
      lastName
      phoneNumber
      currentLocation {
        id
        state
        country
      }
      interest {
        name
      }
      identity {
        name
      }
      connected
    }
  }
`;

// GET FIREBASE TOKEN
export const GET_FIREBASE_TOKEN = gql`
  query generateFirebaseToken {
    generateFirebaseToken {
      firebase_token
    }
  }
`;

//GET ALL IDENTITIES
export const GET_ALL_IDENTITIES = gql`
  query Identity {
    Identity {
      id
      name
    }
  }
`;

// GET USER PROFILE
export const GET_USER_PASSPORT = gql`
  query myPassport {
    myPassport {
      id
      dob {
        formatted
      }
      email
      avatar
      verified
      interest {
        id
        name
      }
      identity {
        id
        name
      }
      lastName
      firstName
      connected
      citizenShip
      phoneNumber
      connectionCount
      communityCount
      birthPlace {
        lat
        long
        country
        state
      }
      currentLocation {
        lat
        long
        country
        state
      }
      privacy {
        blocked {
          id
          firstName
          lastName
        }
        identity
        age
        interest
        locality
        visibility
      }
    }
  }
`;
