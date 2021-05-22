// import React from 'react';
// import { NavigationInterface } from '../../types';
// import { useTranslation } from 'react-i18next';

// import { Container } from './styles';
// import { ScrollView } from 'react-native';
// import WalletCard from './widget';

// // DEFINE SCREEN PROP TYPES
// interface ScreenProp extends NavigationInterface {}

// export default function WalletScreen(props: ScreenProp) {
//   const { t } = useTranslation();
//   const items = [
//     { name: t(`community.passport.linkedAccount`), route: '' },
//     {
//       name: t(`community.passport.transactionHistory`),
//       route: 'TransactionHistoryScreen'
//     },
//     { name: t(`community.passport.accountInfo`), route: '' }
//   ];

//   return (
//     <Container>
//       <ScrollView>
//         {items.map((item) => (
//           <WalletCard {...item} />
//         ))}
//       </ScrollView>
//     </Container>
//   );
// }
