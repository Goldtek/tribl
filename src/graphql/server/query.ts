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
      myConnections {
        id
        bio
        email
        avatar
        pending
        verified
        lastName
        connected
        firstName
        phoneNumber
        communityCount
        connectionCount
        currentLocation {
          country
          state
          city
        }
      }
      participantOf {
        id
        name
        avatar
        isPrivate
        isModerator
        membersCount
      }
      channelParticipantOf {
        id
        name
        isMember
        isPrivate
        community {
          id
          name
          avatar
        }
      }
      recentChannels {
        id
        name
        isMember
        isPrivate
        community {
          id
          name
          avatar
        }
      }
      connectionCount
      communityCount
      lastName
      firstName
      connected
      citizenship {
        id
        name
        flag
      }
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
        citizenship {
          name
          flag
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
        citizenship {
          name
          flag
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
        verified
        avatar
        communityCount
        connectionCount
        pending
        citizenship {
          name
          flag
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
        verified
        pending
        citizenship {
          name
          flag
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
      metadata {
        totalCount
      }
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
        citizenship {
          name
          flag
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
        citizenship {
          name
          flag
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
        verified
        citizenship {
          name
          flag
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
      }
    }
  }
`;

//GET ONE COMMUNITY
export const GET_SINGLE_COMMUNITY = gql`
  query community($input: CommunityArgsInput) {
    Community(input: $input) {
      data {
        id
        name
        avatar
        isMember
        isPrivate
        isInvited
        description
        isModerator
        description
        isRequested
        membersCount
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
      citizenship {
        name
        flag
      }
      connectionDetails {
        status
      }
      moderatorOf {
        isModerator
        id
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

// GET MEMBER PASSPORT
export const GET_MEMBER_PASSPORT = gql`
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
      citizenship {
        name
        flag
      }
      connectionDetails {
        status
      }
      moderatorOf {
        isModerator
        id
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
      myConnections {
        id
        firstName
        lastName
        avatar
        phoneNumber
        currentLocation {
          country
          state
          city
        }
      }
      participantOf {
        id
        name
        avatar
        isPrivate
        isModerator
        membersCount
      }
      channelParticipantOf {
        id
        name
        isMember
        isPrivate
        community {
          id
          avatar
        }
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
        citizenship {
          name
          flag
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
      citizenship {
        name
        flag
      }
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
        citizenship {
          name
          flag
        }
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
        isMember
        isPrivate
        community {
          id
          name
          avatar
        }
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
        community {
          id
          name
          avatar
        }
      }
    }
  }
`;

//GET TRENDING CHANNELS
export const GET_TRENDING_CHANNELS = gql`
  query trendingChannels($input: ChannelArgsInput!) {
    trendingChannels(input: $input) {
      data {
        channel {
          id
          name
          isDefault
          isPrivate
          community {
            id
            name
            avatar
          }
        }
      }
    }
  }
`;
