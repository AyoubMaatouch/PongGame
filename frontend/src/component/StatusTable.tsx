import * as React from 'react';
import { Table, Tbody, Tfoot, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

// TYPE
type Props = {
    wins: number;
    losses: number;
    draws: number;
    played: number;
};

export const StatusTable = ({ played, wins, losses, draws }: Props) => {
    return (
        <TableContainer w="100%">
            <Table variant="simple" fontSize="md">
                <Tbody>
                    <Tr>
                        <Td>Total Games</Td>
                        <Td isNumeric>{played}</Td>
                    </Tr>
                    <Tr>
                        <Td>Wins</Td>
                        <Td isNumeric color="green">
                            {wins}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Losses</Td>
                        <Td isNumeric color="red">
                            {losses}
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Draws</Td>
                        <Td isNumeric>{draws}</Td>
                    </Tr>
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Win rate</Th>
                        <Th isNumeric>{played === 0 ? 0 : Math.round((wins / played) * 100)}%</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};
