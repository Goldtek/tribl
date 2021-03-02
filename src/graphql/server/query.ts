import gql from 'graphql-tag';

/*
 ****************************************************************
 *****************    APOLLO SERVER QUERIES   *******************
 ****************************************************************
 */

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
  query Identity($input: IdentityArgsInput) {
    Identity(input: $input) {
      data {
        id
        name
        isAdmin
      }
    }
  }
`;

//GET ALL INTEREST
export const GET_ALL_INTEREST = gql`
  query Interest {
    Interest {
      data {
        id
        name
      }
    }
  }
`;

// GET USER PROFILE
export const GET_USER_PASSPORT = gql`
  query myPassport {
    myPassport {
      id
      dob
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
      connectionCount
      communityCount
      lastName
      firstName
      connected
      citizenShip
      phoneNumber
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
        lastSeen
      }
    }
  }
`;

// GET  RECOMMENDED MEMBERS
export const GET_RECOMMENDED_MEMBERS = gql`
  query RecommendedMembers($input: RecommendationPassportArgsInput) {
    recommendedMembers(input: $input) {
      data {
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
        pending
        connectionDetails {
          status
        }
        moderatorOf {
          isModerator
          id
        }
        participantOf {
          isModerator
        }
        birthPlace {
          country
          state
          city
        }
        currentLocation {
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
    }
  }
`;

// GET  NEARBY MEMBERS
export const GET_NEARBY_MEMBERS = gql`
  query nearbyMembers($input: RecommendationPassportArgsInput) {
    nearbyMembers(input: $input) {
      metadata {
        totalCount
      }
      data {
        id
        bio
        email
        firstName
        lastName
        phoneNumber
        connected
        avatar
        verified
        communityCount
        connectionCount
        pending
        moderatorOf {
          isModerator
          id
        }
        participantOf {
          isModerator
        }
        birthPlace {
          country
          state
          city
          lat
          long
        }
        currentLocation {
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
        connectionDetails {
          status
        }
        presence {
          status
          lastSeen
        }
      }
    }
  }
`;

//GET CHANNEL MEMBERS
export const GET_CHANNEL_MEMBERS = gql`
  query channelMembers($input: ChannelMemberInput!) {
    channelMembers(input: $input) {
      metadata {
        totalCount
      }
      data {
        id
        bio
        email
        firstName
        lastName
        phoneNumber
        connected
        avatar
        verified
        communityCount
        connectionCount
        pending
        birthPlace {
          country
          state
          city
          lat
          long
        }
        currentLocation {
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
        connectionDetails {
          status
        }
        presence {
          status
          lastSeen
        }
      }
    }
  }
`;

// GET NEARBY MEMBERS OF A COMMUNITY
export const GET_NEARBY_MEMBERS_OF_A_COMMUNITY = gql`
  query nearbyMembers($input: RecommendationPassportArgsInput) {
    nearbyMembers(input: $input) {
      data {
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
        pending
        moderatorOf {
          isModerator
          id
        }
        participantOf {
          isModerator
        }
        birthPlace {
          country
          state
          city
          lat
          long
        }
        currentLocation {
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
        connectionDetails {
          status
        }
        presence {
          status
          lastSeen
        }
      }
    }
  }
`;

// GET  RECOMMENDED COMMUNITIES
export const GET_RECOMMENDED_COMMUNITIES = gql`
  query recommendedCommunities {
    recommendedCommunities(input: { limit: 5 }) {
      data {
        id
        avatar
        name
        membersCount
        description
        isMember
        isPrivate
        isModerator
        isRequested
        isInvited
        tags {
          id
          name
        }
        uniqueInterests {
          name
          id
        }
      }
    }
  }
`;

//GET POPULAR COMMUNITIES
export const GET_POPULAR_COMMUNITIES = gql`
  query popularCommunities($input: CommunityArgsInput) {
    popularCommunities(input: $input) {
      data {
        id
        name
        description
        avatar
        membersCount
        isMember
        isPrivate
        isModerator
        isRequested
        isInvited
        tags {
          id
          name
        }
        uniqueInterests {
          name
          id
        }
      }
    }
  }
`;

//GET MY COMMUNITIES
export const GET_MY_COMMUNITIES = gql`
  query myCommunities {
    myCommunities {
      metadata {
        totalCount
      }
      data {
        id
        description
        avatar
        name
        isMember
        isPrivate
        membersCount
        isModerator
        isRequested
        isInvited
        tags {
          id
          name
        }
        uniqueInterests {
          name
          id
        }
      }
    }
  }
`;

//GET MY CONNECTIONS NEARBY
export const GET_MY_CONNECTIONS_NEARBY = gql`
  query nearbyConnections($input: ConnectionArgsInput) {
    nearbyConnections(input: $input) {
      metadata {
        totalCount
      }
      data {
        id
        bio
        email
        firstName
        lastName
        avatar
        verified
        phoneNumber
        connected
        pending
        connectionCount
        communityCount
        birthPlace {
          country
          state
          city
          lat
          long
        }
        currentLocation {
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
          lastSeen
        }
        connectionDetails {
          status
        }
      }
    }
  }
`;

//GET MY CONNECTIONS
export const GET_MY_CONNECTIONS = gql`
  query myConnections($input: ConnectionArgsInput) {
    myConnections(input: $input) {
      metadata {
        totalCount
      }
      data {
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
        pending
        birthPlace {
          country
          state
          city
          lat
          long
        }
        currentLocation {
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
          lastSeen
        }
        connectionDetails {
          status
        }
      }
    }
  }
`;

//GET MY CONNECTION REQUESTS
export const GET_CONNECTION_REQUEST = gql`
  query connectionRequests($input: ConnectionArgsInput) {
    connectionRequests(input: $input) {
      metadata {
        totalCount
      }
      data {
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
          country
          state
          city
          lat
          long
        }
        currentLocation {
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
          lastSeen
        }
        connectionDetails {
          status
        }
      }
    }
  }
`;

//GET ONE COMMUNITY
export const GET_SINGLE_COMMUNITY = gql`
  query community($input: CommunityArgsInput!) {
    Community(input: $input) {
      data {
        description
        id
        avatar
        membersCount
        isMember
        name
        isPrivate
        isModerator
        description
        isRequested
        isInvited
        tags {
          id
          name
        }
        uniqueInterests {
          name
          id
        }
      }
    }
  }
`;

// GET ONE PASSPORT
export const GET_SINGLE_PASSPORT = gql`
  query singlePassport($id: String!) {
    singlePassport(id: $id) {
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
      pending
      myConnections {
        id
        firstName
        lastName
        avatar
        phoneNumber
      }
      connectionDetails {
        status
      }
      moderatorOf {
        isModerator
        id
      }
      participantOf {
        isModerator
        name
        avatar
      }
      birthPlace {
        country
        state
        city
      }
      currentLocation {
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
  }
`;

//GET PARTICIPANTS OF A COMMUNITY
export const GET_COMMUNITY_MEMBERS = gql`
  query communityMembers($input: CommunityMembersArgsInput) {
    communityMembers(input: $input) {
      data {
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
        pending
        moderatorOf {
          isModerator
          id
        }
        participantOf {
          isModerator
        }
        birthPlace {
          country
          state
          city
          lat
          long
        }
        currentLocation {
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
        connectionDetails {
          status
        }
        presence {
          status
          lastSeen
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
      pending
      moderatorOf {
        isModerator
        id
      }
      participantOf {
        isModerator
      }
      currentLocation {
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
        state
        country
        city
      }
      connectionDetails {
        status
      }
    }
  }
`;

//GET ALL MEMBERS ON THE APP
export const GET_ALL_MEMBERS = gql`
  query Passport($input: PassportArgsInput) {
    Passport(input: $input) {
      metadata {
        totalCount
      }
      data {
        id
        avatar
        phoneNumber
        verified
        firstName
        lastName
        email
        connected
        bio
        pending
        currentLocation {
          state
          country
          city
          lat
          long
        }
        birthPlace {
          state
          country
          city
          lat
          long
        }
        connectionDetails {
          status
        }
        presence {
          status
          lastSeen
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
  query myChannels($input: ChannelArgsInput) {
    myChannels(input: $input) {
      data {
        id
        name
      }
    }
  }
`;

//GET ALL TRIBE INVITES
export const GET_TRIBE_INVITES = gql`
  query communityInvites($input: CommunityRequestArgsInput) {
    communityInvites(input: $input) {
      data {
        id
        status
        type
        createdAt
        community {
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
          tags {
            id
            name
          }
        }
        sender {
          id
          email
          firstName
          lastName
          phoneNumber
          connected
          avatar
          bio
          moderatorOf {
            isModerator
            id
          }
          pending
          communityCount
          connectionCount
          currentLocation {
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
            state
            country
            city
          }
          presence {
            status
            lastSeen
          }
          connectionDetails {
            status
          }
        }
        receipient {
          id
          email
          firstName
          lastName
          phoneNumber
          connected
          avatar
          bio
          moderatorOf {
            isModerator
            id
          }
          pending
          communityCount
          connectionCount
          currentLocation {
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
            state
            country
            city
          }
          presence {
            status
            lastSeen
          }
          connectionDetails {
            status
          }
        }
      }
    }
  }
`;

//GET ALL TRIBE REQUESTS
export const GET_TRIBE_REQUESTS = gql`
  query communityRequests($input: CommunityRequestArgsInput!) {
    communityRequests(input: $input) {
      data {
        id
        status
        type
        createdAt
        community {
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
          tags {
            id
            name
          }
        }
        sender {
          id
          email
          firstName
          lastName
          phoneNumber
          connected
          avatar
          bio
          moderatorOf {
            isModerator
            id
          }
          pending
          communityCount
          connectionCount
          currentLocation {
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
            state
            country
            city
          }
          presence {
            status
            lastSeen
          }
          connectionDetails {
            status
          }
        }
        receipient {
          id
          email
          firstName
          lastName
          phoneNumber
          connected
          avatar
          bio
          moderatorOf {
            isModerator
            id
          }
          pending
          communityCount
          connectionCount
          currentLocation {
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
            state
            country
            city
          }
          presence {
            status
            lastSeen
          }
          connectionDetails {
            status
          }
        }
      }
    }
  }
`;

// GET ALL USER CHANNELS
export const GET_COMMUNITY_CHANNELS = gql`
  query communityChannels($input: ChannelArgsInput!) {
    Channel(input: $input) {
      metadata {
        totalCount
      }
      data {
        id
        name
        isMember
      }
    }
  }
`;
