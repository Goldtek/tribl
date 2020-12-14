import gql from 'graphql-tag';

/*
 ****************************************************************
 *****************    APOLLO SERVER QUERIES   *******************
 ****************************************************************
 */

// GET  RECOMMENDED MEMBERS
export const GET_RECOMMENDED_MEMBERS = gql`
  query RecommendedMembers($filter: _PassportFilter!) {
    recommendedMembers(filter: $filter, first: 8) {
      id
      bio
      email
      firstName
      lastName
      avatar
      verified
      phoneNumber
      connected
      connectionCount
      communityCount
      birthPlace {
        id
        country
        state
        city
      }
      currentLocation {
        id
        country
        state
        city
        lat
        long
      }
      identity {
        name
      }
      interest {
        name
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
    }
  }
`;

// GET  NEARBY MEMBERS
export const GET_NEARBY_MEMBERS = gql`
  query nearbyMembers($offset: Int, $first: Int) {
    nearbyMembers(offset: $offset, first: $first) {
      id
      bio
      email
      firstName
      lastName
      phoneNumber
      connected
      avatar
      communityCount
      connectionCount
      birthPlace {
        id
        country
        state
        city
        lat
        long
      }
      currentLocation {
        id
        country
        state
        city
        lat
        long
      }
      identity {
        name
      }
      interest {
        name
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
      presence {
        status
        lastSeen {
          formatted
          day
          month
          year
        }
      }
    }
  }
`;

// GET NEARBY MEMBERS OF A COMMUNITY
export const GET_NEARBY_MEMBERS_OF_A_COMMUNITY = gql`
  query nearbyMembers($filter: _PassportFilter!) {
    nearbyMembers(filter: $filter, first: 8) {
      id
      bio
      email
      firstName
      lastName
      phoneNumber
      connected
      avatar
      communityCount
      connectionCount
      birthPlace {
        id
        country
        state
        city
        lat
        long
      }
      currentLocation {
        id
        country
        state
        city
        lat
        long
      }
      identity {
        name
      }
      interest {
        name
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
      presence {
        status
        lastSeen {
          formatted
          day
          month
          year
        }
      }
    }
  }
`;

// GET  RECOMMENDED COMMUNITIES
export const GET_RECOMMENDED_COMMUNITIES = gql`
  query recommendedCommunities {
    recommendedCommunities(first: 5) {
      id
      avatar
      name
      membersCount
      description
      isMember
      channels {
        id
        name
        isMember
      }
      interests {
        id
        name
      }
      uniqueInterests {
        name
        id
      }
    }
  }
`;

//GET POPULAR COMMUNITIES
export const GET_POPULAR_COMMUNITIES = gql`
  query popularCommunities($offset: Int, $first: Int) {
    popularCommunities(offset: $offset, first: $first) {
      id
      name
      description
      avatar
      membersCount
      isMember
      channels {
        id
        name
        isMember
      }
      interests {
        id
        name
      }
      uniqueInterests {
        name
        id
      }
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
      name
      isMember
      membersCount
      channels {
        id
        name
        isMember
      }
      interests {
        id
        name
      }
      uniqueInterests {
        name
        id
      }
    }
  }
`;

//GET MY CONNECTIONS
export const GET_MY_CONNECTIONS = gql`
  query myConnections($offset: Int, $first: Int) {
    myConnections(offset: $offset, first: $first) {
      id
      bio
      email
      firstName
      lastName
      avatar
      phoneNumber
      connected
      connectionCount
      communityCount
      birthPlace {
        id
        country
        state
        city
        lat
        long
      }
      currentLocation {
        id
        country
        state
        city
        lat
        long
      }
      identity {
        name
      }
      interest {
        name
      }
      presence {
        status
        lastSeen {
          formatted
          day
          month
          year
        }
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
    }
  }
`;

//GET MY CONNECTION REQUESTS
export const GET_CONNECTION_REQUEST = gql`
  query connectionRequests($offset: Int, $first: Int) {
    connectionRequests(offset: $offset, first: $first) {
      id
      bio
      email
      firstName
      lastName
      avatar
      phoneNumber
      connected
      connectionCount
      communityCount
      birthPlace {
        id
        country
        state
        city
        lat
        long
      }
      currentLocation {
        id
        country
        state
        city
        lat
        long
      }
      identity {
        name
      }
      interest {
        name
      }
      presence {
        status
        lastSeen {
          formatted
          day
          month
          year
        }
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
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
      membersCount
      isMember
      name
      description
      channels {
        id
        name
        isMember
      }
      interests {
        id
        name
      }
      uniqueInterests {
        name
        id
      }
    }
  }
`;

// GET ONE PASSPORT
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
      bio
      participantOf {
        id
        name
        membersCount
        description
        avatar
        isMember
        isModerator
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
          conversation {
            id
            messageRequest {
              id
              senderId
              approvedAt {
                formatted
                day
                month
                year
              }
              createdAt {
                formatted
                day
                month
                year
              }
            }
          }
        }
        membersCount
      }
      myConnections {
        id
        email
        firstName
        lastName
        avatar
        phoneNumber
        connected
        connectionCount
        communityCount
        bio
        birthPlace {
          id
          country
          state
          city
          lat
          long
        }
        currentLocation {
          id
          country
          state
          city
          lat
          long
        }
        identity {
          name
        }
        interest {
          name
        }
      }
      communityCount
      connectionCount
      currentLocation {
        id
        country
        state
        city
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
        city
        lat
        long
      }
      presence {
        status
        lastSeen {
          formatted
          day
          month
          year
        }
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
    }
  }
`;

// GET ONE PASSPORT
export const GET_COMMUNITY_MEMBER_PASSPORT = gql`
  query singlePassport($id: String) {
    singlePassport(id: $id) {
      id
      email
      firstName
      lastName
      phoneNumber
      connected
      avatar
      bio
      communityCount
      connectionCount
      currentLocation {
        id
        country
        state
        city
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
        city
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
    }
  }
`;

//GET PARTICIPANTS OF A COMMUNITY
export const GET_COMMUNITY_MEMBERS = gql`
  query communityMembersCommunityChannels($id: ID!) {
    communityMembers(communityId: $id, first: 8) {
      id
      bio
      email
      firstName
      lastName
      avatar
      phoneNumber
      connected
      connectionCount
      communityCount
      birthPlace {
        id
        country
        state
        city
        lat
        long
      }
      currentLocation {
        id
        country
        state
        city
        lat
        long
      }
      identity {
        name
      }
      interest {
        name
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
      presence {
        status
        lastSeen {
          formatted
          day
          month
          year
        }
      }
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
        day
        month
        year
      }
      bio
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
      currentLocation {
        country
        state
        city
        lat
        long
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
      presence {
        status
        lastSeen {
          formatted
          day
          month
          year
        }
      }
    }
  }
`;

//GET ALL MEMBERS ON THE APP
export const GET_ALL_MEMBERS = gql`
  query Passport($offset: Int, $first: Int) {
    Passport(verified: true, offset: $offset, first: $first) {
      id
      avatar
      phoneNumber
      verified
      firstName
      lastName
      email
      connected
      bio
      currentLocation {
        state
        country
        city
        id
        lat
        long
      }
      birthPlace {
        state
        country
        city
        id
        lat
        long
      }
      conversation {
        id
        messageRequest {
          id
          senderId
          approvedAt {
            formatted
            day
            month
            year
          }
          createdAt {
            formatted
            day
            month
            year
          }
        }
      }
      presence {
        status
        lastSeen {
          formatted
          day
          month
          year
        }
      }
    }
  }
`;

// SUBSCRIPTION TO USER ONLINE PRESENCE
export const USER_ONLINE_SUBSCRIPTION = gql`
  subscription monitorPresence {
    monitorPresence {
      type
      payload {
        id
        type
        status
        lastSeen
      }
    }
  }
`;

// GET ALL USER CHANNELS
export const USER_CHANNELS = gql`
  query myChannels($offset: Int, $first: Int) {
    myChannels(offset: $offset, first: $first) {
      id
      name
    }
  }
`;
