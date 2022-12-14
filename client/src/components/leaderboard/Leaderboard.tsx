import {
    Box,
    Heading,
    Radio,
    RadioGroup,
    Stack,
    useColorMode,
    VStack
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { LeaderboardItem } from "./leaderboardItem";
import { Donation } from "../../types";
import { useQuery } from "urql";

const DonationsQuery = `
  query Query($orderBy: OrderByParams) {
    donations(orderBy: $orderBy) {
      count
      id
      displayName
      createdAt
      message
      team
    }  
  }
`;

type DonationsQueryRes = {
    donations: Donation[];
};

interface Props {}

export const Leaderboard = (props: Props) => {
    const [field, setOrderByField] = useState('createdAt');
    const { colorMode } = useColorMode();

    const [{ data, fetching, error }] = useQuery<DonationsQueryRes>({
        query: DonationsQuery,
        variables: {
            orderBy: {
                field,
                direction: 'desc',
            },
        },
    });

    if (error) return <p>Oh no... { error.message }</p>;
    if (fetching || !data) return <p>Loading...</p>;

    return (
        <Box w="100%">
            <VStack spacing={4}>
               <Box
                   boxShadow="xl"
                    p={8}
                    mb={8}
                    bg={ colorMode === "light" ? "white" : "dark" }
                    borderRadius="xl"
                    minW="sm"
                    border={ colorMode === "light" ? "" : "1px" }
               >
                <Heading as="h1" size="2xl">
                    LEADERBOARD
                </Heading>
               </Box>
                <RadioGroup onChange={setOrderByField} value={field}>
                    <Stack direction='row'>
                        <Radio value='createdAt'>Most Recent</Radio>
                        <Radio value='count'>Most Donations</Radio>
                    </Stack>
                </RadioGroup>

                { data.donations.map(donation =>
                    <LeaderboardItem key={donation.id} donation={donation} colorMode={colorMode}/>) }
            </VStack>
        </Box>
    )
};