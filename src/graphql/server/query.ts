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
      connected
      avatar
      connectionCount
      communityCount
      currentLocation {
        id
        country
        state
        city
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
        city
      }
      identity {
        name
      }
      interest {
        name
      }
      birthPlace {
        id
        city
        state
        country
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
  }
`;

//GET MY CONNECTIONS
export const GET_MY_CONNECTIONS = gql`
  query myConnections {
    myConnections {
      id
      firstName
      lastName
      phoneNumber
      avatar
      conversation {
        id
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

//GET MY CONNECTION REQUESTS
export const GET_CONNECTION_REQUEST = gql`
  query connectionRequests {
    connectionRequests {
      id
      avatar
      firstName
      lastName
      phoneNumber
      connected
      connection {
        createdAt {
          day
          month
          hour
          second
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
      bio
      participantOf {
        id
        name
        avatar
      }
      myConnections {
        id
        firstName
        lastName
        avatar
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
  query communityMembersCommunityChannels($id: ID!) {
    communityMembers(communityId: $id) {
      id
      avatar
      firstName
      lastName
      phoneNumber
      currentLocation {
        id
        state
        country
        city
      }
      interest {
        name
      }
      identity {
        name
      }
      connected
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
      birthPlace {
        lat
        long
        city
        country
        state
      }
      currentLocation {
        lat
        long
        country
        state
        city
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

//GET ALL MEMBERS ON THE APP
export const GET_ALL_MEMBERS = gql`
  query Passport {
    Passport(verified: true) {
      id
      avatar
      phoneNumber
      verified
      firstName
      lastName
      email
      connected
      bio
      participantOf {
        id
        name
        avatar
      }
      currentLocation {
        state
        country
        city
        id
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
