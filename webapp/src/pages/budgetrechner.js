import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import { Title, Text, Card, NumberInput, NumberFormatter, Box, Flex } from '@mantine/core';
import { IconShare3 } from '@tabler/icons-react';

const Imprint = () => {
  const [equity, setEquity] = useState(40000);
  const [installment, setInstallment] = useState(1200);
  const [interest, setInterest] = useState(6);
  const [years, setYears] = useState(30);

  const calculateAnnuity = () => {
    const monthlyInterest = ((interest || 0) / 100) / 12;
    const months = (years || 1) * 12;
    
    const loanAmount = (installment * (1 - Math.pow(1 + monthlyInterest, -months)) / monthlyInterest) + (equity || 0)
    
    return loanAmount.toFixed(2);
  }
  

  return (
    <Layout title="Budgetrechner | ImmoRadar" description="Finde heraus, wie viel deine Immobilie kosten kann mit unserem detaillierten Budgetrechner.">
      <Title order={1} py="xl">Budgetrechner</Title>
      <Text mb="xl">Finde heraus, wie viel deine Immobilie kosten kann mit unserem detaillierten Budgetrechner.</Text>
      <Card mb="xl">
        <NumberInput
          size="lg"
          label="Eigenkapital"
          // description="Wie viel kannst du selbst finanzieren?"
          placeholder="50 000€"
          decimalScale={0}
          min={0}
          thousandSeparator=" "
          suffix="€"
          mb="md"
          value={equity}
          onChange={(value) => setEquity(value)}
        />

        <NumberInput
          size="lg"
          label="Monatliche Rate"
          // description="Welchen Betrag kannst du monatlich abzahlen?"
          placeholder="1 200€"
          decimalScale={0}
          min={100}
          thousandSeparator=" "
          suffix="€"
          mb="md"
          value={installment}
          onChange={(value) => setInstallment(value)}
        />

        <NumberInput
          size="lg"
          label="Zinssatz"
          // description="Wie viel Zinsen zahlst du im Jahr auf deinen Kredit?"
          placeholder="6%"
          decimalSeparator=","
          decimalScale={2}
          min={0}
          max={50}
          thousandSeparator=" "
          suffix="%"
          mb="md"
          value={interest}
          onChange={(value) => setInterest(value)}
        />

        <NumberInput
          size="lg"
          label="Schuldenfrei in"
          // description="Bis wann soll der Kredit abbezahl sein?"
          placeholder="30 Jahren"
          decimalScale={0}
          thousandSeparator=" "
          min={1}
          max={50}
          suffix=" Jahren"
          mb="md"
          value={years}
          onChange={(value) => setYears(value)}
        />

        <Text fw={500} mt="md" mb="sm" size="lg">Maximaler Finanzierungsbetrag für den Immobilienkauf:</Text>
        <Text c="green.9" fw={600} size="2.4em" lh="1em" mb="xl" td="underline">
          <NumberFormatter
            suffix='€'
            value={calculateAnnuity()}
            thousandSeparator=" "
            decimalScale={0}
          />
        </Text>

        <Link href="/grundstuecke/suchen">
          <Card radius="md" p="md" bg="cyan.0">
            <Flex justify="space-between" align="center">
              <Box>
                <Text>Du bist auf der Suche nach einem Grundstück?</Text>
                <Text fw={500} c="black">Finde ein Perfektes Grundstück mit unserer Grundstückbörse.</Text>
              </Box>
              <IconShare3 c="gray.7"/>
            </Flex>
          </Card>
        </Link>
      </Card>
    </Layout>
  );
};

export default Imprint;