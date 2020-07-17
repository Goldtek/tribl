import gql from 'graphql-tag';

const schema = gql`
  extend type Query {
    userDetails: String!
  }

  extend type Mutation {
    changeUserCountry(id: String!): [String!]!
    sendOtp(input: SendOtpInput!): OtpSuccess!
    validateOtp(input: ValidateOtpInput!): JwtTokenResult!
  }
`;

export default schema;
