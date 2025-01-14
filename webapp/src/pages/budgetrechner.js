import React, { useState, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import NextImage from 'next/image';
import Layout from '@/components/Layout/Layout';
import { Title, Text, Card, NumberInput, NumberFormatter, Box, Flex, Image, Button, ActionIcon, Popover, Slider } from '@mantine/core';
import { IconShare3, IconQuestionMark } from '@tabler/icons-react';
import styles from '@/styles/Home.module.css'

const CustomLabel = ({ label, desciption }) => {
  const [opened, { close, open }] = useDisclosure(false);

  return <Flex gap="xs" align="center">
    <Text>{label}</Text>
    <Popover width={300} position="bottom" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <ActionIcon
          variant="outline" radius="xl" aria-label="Erklärung" size="xs"
          onMouseEnter={open} onMouseLeave={close}
          onClick={() => {
            if (opened) { close() }
            else { open() }
          }}
        >
          <IconQuestionMark style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Text size="sm">{desciption}</Text>
      </Popover.Dropdown>
    </Popover>
  </Flex>
}

const BudgetCalculator = () => {
  const scollToRef = useRef();
  const [equity, setEquity] = useState(40000);
  const [installment, setInstallment] = useState(1200);
  const [interest, setInterest] = useState(3);
  const [years, setYears] = useState(25);

  const calculateAnnuity = () => {
    const monthlyInterest = ((interest || 0) / 100) / 12;
    const months = (years || 1) * 12;

    const loanAmount = (installment * (1 - Math.pow(1 + monthlyInterest, -months)) / monthlyInterest) + (equity || 0)

    return loanAmount.toFixed(2);
  }


  return (
    <Layout title="Budgetrechner | ImmoRadar" description="Berechnen Sie schnell und einfach, wie viel Ihr Haus kosten darf. Unser Budgetrechner kalkuliert anhand von Eigenkapital, Zinssatz und monatlicher Belastung den maximalen Kaufpreis, den Sie sich leisten können.">
      <Flex align="center" gap="xl" direction={{ base: "column-reverse", sm: "row" }} my="3rem">
        <Box p={{ base: "sm", sm: "0" }}>
          <Title order={1} ta={{ base: 'center', sm: 'left' }} fz={{ base: 34, xs: 42, md: 60 }} fw="bold" mb="lg" textWrap="balance">
            <span className={styles.gradientText}>Budgetrechner</span>
          </Title>
          <Text size="lg" mb="xl" ta={{ base: 'center', sm: 'left' }}>
            Berechne schnell und einfach, wie viel Dich Dein Traumhaus kosten darf.
            Unser Budgetrechner kalkuliert anhand von Eigenkapital, Finanzierungszins und deiner persönlichen Wunschrate.
          </Text>
          <Button
            variant="outline"
            onClick={() => scollToRef.current.scrollIntoView({ behavior: "smooth" })}
            w={{ base: '100%', sm: 'auto' }}
          >
            Jetzt Berechnen
          </Button>
        </Box>

        <Image
          radius="md"
          component={NextImage}
          src="/imgs/calculator2.jpg"
          alt="Leeres Grundstück von oben"
          height={250}
          width={250}
          w={250}
        />
      </Flex>

      <Card mb="xl" ref={scollToRef}>
        <Flex justify="space-between" gap="md" direction={{ base: "column", xs: "row" }}>
          <Box w={{ base: "100%", xs: "67%" }}>
            <NumberInput
              label={<CustomLabel label="Dein Eigenkapital" desciption="Welche Summe an Kapital kannst Du in Dein Projekt Traumimmobilie mit einbringen" />}
              placeholder="50 000€"
              decimalScale={0}
              min={0}
              thousandSeparator=" "
              suffix="€"
              mb="md"
              value={equity}
              onChange={(value) => setEquity(parseInt(value))}
            />

            <CustomLabel label="Deine Wunschrate" desciption="Welche monatlichen „Ab- Sparrate“ für die Finanzierung ist für Dich ideal?" />
            <Slider
              my="xl"
              labelAlwaysOn
              size="xl"
              decimalScale={0}
              min={100}
              max={5000}
              step={100}
              thousandSeparator=" "
              suffix="€"
              label={(value) => <NumberFormatter
                suffix='€'
                value={value}
                thousandSeparator=" "
                decimalScale={0}
              />}
              mb="md"
              value={installment}
              onChange={(value) => setInstallment(value)}
            />

            <CustomLabel label="Finanzierungszins" desciption="Hier stellst Du den Zins für die Finanzierung ein." />
            <Slider
              my="xl"
              labelAlwaysOn
              size="xl"
              decimalScale={1}
              min={1}
              max={5}
              step={0.1}
              thousandSeparator=" "
              suffix="€"
              label={(value) => <NumberFormatter
                suffix='%'
                value={value}
                decimalScale={1}
              />}
              mb="md"
              value={interest}
              onChange={(value) => setInterest(value)}
            />

            <CustomLabel label="Schuldenfrei in" desciption="Wann soll Deine Traumimmobilie komplett Dir gehören?" />
            <Slider
              my="xl"
              labelAlwaysOn
              size="xl"
              decimalScale={0}
              min={5}
              max={40}
              step={1}
              thousandSeparator=" "
              suffix=" Jahren"
              label={(value) => <NumberFormatter
                suffix=' Jahren'
                value={value}
                decimalScale={0}
              />}
              mb="md"
              value={years}
              onChange={(value) => setYears(value)}
            />
          </Box>

          <Box w={{ base: "100%", xs: "33%"}} ta={{ base: 'left', xs: 'center' }}>
            <Image
              component={NextImage}
              src="/imgs/house-logo.png"
              alt="Minimalistisches Haus"
              height={200}
              width={200}
              w={200}
              mb="md"
              mx="auto"
              display={{ base: "none", xs: "block" }}
            />
            <Text fw={500} mt="md" mb="sm" size="lg">Gesamtbudget für Dein Projekt „Traumhaus“:</Text>
            <Text c="green.9" fw={600} size="2.4em" lh="1em" mb="xl" td="underline">
              <NumberFormatter
                suffix='€'
                value={calculateAnnuity()}
                thousandSeparator=" "
                decimalScale={0}
              />
            </Text>
          </Box>

        </Flex>

        <Link href="/suche">
          <Card radius="md" p="md" bg="cyan.0">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fw={500} c="black">ImmoRadar Grundstückbörse</Text>
                <Text>Entdecke exklusive Grundstücke, die du sonst nirgendwo findest.</Text>
              </Box>
              <IconShare3 c="gray.7" />
            </Flex>
          </Card>
        </Link>
      </Card>
    </Layout>
  );
};

export default BudgetCalculator;