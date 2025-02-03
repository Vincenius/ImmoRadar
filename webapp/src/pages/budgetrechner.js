import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import NextImage from 'next/image';
import Layout from '@/components/Layout/Layout';
import PhoneInput from '@/components/PhoneInput/PhoneInput';
import { isValidPhoneNumber } from 'libphonenumber-js'
import { Title, Text, Card, NumberInput, NumberFormatter, Box, Flex, Image, Button, ActionIcon, Popover, Slider, Modal, Stepper, NativeSelect, Group, TextInput } from '@mantine/core';
import { IconCheck, IconQuestionMark } from '@tabler/icons-react';
import Checkbox from '@/components/Inputs/Checkbox';
import styles from '@/styles/Home.module.css'
import Logo from './logo.svg';

const ButtonGroup = ({ active, setActive, isLoading }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button>}
    {active < 2 && <Button type="submit" loading={isLoading}>Weiter</Button>}
  </Group>
}

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

const ContactModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [active, setActive] = useState(0);
  const [data, setData] = useState({})
  const [phone, setPhone] = useState('');
  const [isPhoneError, setIsPhoneError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const numberFormatElements = ['AmountPeople', 'Age']
  const handleSubmit = (e) => {
    e.preventDefault();

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name) {
        if (element.name === 'Phone') {
          if (isValidPhoneNumber(phone)) {
            formObject[element.name] = phone;
          } else {
            setIsPhoneError(true)
            return
          }
        } else if (numberFormatElements.includes(element.name)) {
          formObject[element.name] = parseInt(element.value.replaceAll(' ', ''));
        } else {
          formObject[element.name] = element.value;
        }
      }
    }

    const newData = {
      ...data,
      ...formObject
    }

    if (active === 1) {
      setIsLoading(true)

      fetch('/api/user-signup', {
        method: 'POST',
        body: JSON.stringify({
          ...newData,
          type: 'budget-calculator'
        }),
      }).then(() => {
        setActive(active + 1)
      }).catch((err) => {
        // todo error handling
      }).finally(() => {
        setIsLoading(false)
      })
    } else {
      setData(newData)
      setActive(active + 1)
    }
  }

  return <>
    <Button onClick={open} mt="md" w={320} m="2em auto 1em">
      Du möchtest mehr für Dich herausholen?
    </Button>
    <Flex gap="sm" justify={{ xs: "center", base: "flex-start" }} align="center" mb="xs">
      <IconCheck style={{ width: '20px', height: '20px' }} stroke={1.5} />
      <Text td="italic" align="left">
        Kostenloser und unverbindlicher Fördercheck
      </Text>
    </Flex>
    <Flex gap="sm" justify={{ xs: "center", base: "flex-start" }} align="center">
      <IconCheck style={{ width: '20px', height: '20px' }} stroke={1.5} />
      <Text td="italic" align="left">
        Strategischer Aufbau und Ausbau deines Eigenkapitals
      </Text>
    </Flex>
    
    <Modal opened={opened} onClose={close} size="md">
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step>
          {/* <Title order={2} size="h3" mb="lg">Erzähle uns etwas zu Dir</Title> */}

          <form onSubmit={handleSubmit}>
            <NumberInput
              label="Wieviele Personen ziehen in das Haus ein?"
              placeholder="3"
              required
              hideControls
              mb="sm"
              name="AmountPeople"
              min={1}
              max={15}
              decimalScale={0}
              defaultValue={data.AmountPeople}
            />

            <NativeSelect
              label="Familienstand"
              data={[
                { value: 'ledig', label: 'Ledig' },
                { value: 'verheiratet', label: 'Verheiratet' },
              ]}
              required
              mb="sm"
              name="MaritalStatus"
              defaultValue={data.MaritalStatus}
            />

            <NumberInput
              label="Wie alt bist Du?"
              placeholder="30"
              required
              hideControls
              mb="sm"
              name="Age"
              min={18}
              max={90}
              decimalScale={0}
              defaultValue={data.Age}
            />

            <NativeSelect
              label="Jahreseinkommen"
              data={[
                { value: '<50k', label: 'unter 50 000 Brutto' },
                { value: '50k-75k', label: '50 000 - 75 000 Brutto' },
                { value: '>75k', label: 'über 75 000 Brutto' },
              ]}
              required
              mb="sm"
              name="Income"
              defaultValue={data.Income}
            />

            <ButtonGroup active={active} setActive={setActive} />
          </form>
        </Stepper.Step>
        <Stepper.Step>
          <Title order={2} size="h3" mb="lg">Vielen Dank für Deine Antworten!</Title>
          <Text mb="md">In einem persönlichen Telefonat besprechen wir konkret wie Deine persönliche Strategie Traumhaus aussehen kann.</Text>

          <form onSubmit={handleSubmit}>
            <Flex gap="md">
              <TextInput
                label="Vorname"
                placeholder="Max"
                required
                mb="sm"
                name="Firstname"
                defaultValue={data.Firstname}
              />
              <TextInput
                label="Nachname"
                placeholder="Musterman"
                required
                mb="sm"
                name="Lastname"
                defaultValue={data.Lastname}
              />
            </Flex>
            <Flex gap="md">
              <TextInput
                label="Email"
                placeholder="maxmustermann@example.com"
                required
                mb="sm"
                name="Email"
                type="email"
                defaultValue={data.Email}
              />
              <PhoneInput
                label="Telefon"
                placeholder="1711234567"
                required
                mb="md"
                name="Phone"
                initialCountryCode="DE"
                value={phone}
                onChange={value => {
                  setPhone(value)
                  setIsPhoneError(false)
                }}
                defaultValue={phone}
                error={isPhoneError && 'Bitte gib eine gültige Telefonnummer ein'}
              />
            </Flex>

            <Checkbox
              required
              label={<Text>Ich habe die <Link href="/datenschutz">Datenschutzbestimmungen</Link> gelesen und stimme ihnen zu.</Text>}
            />

            <ButtonGroup active={active} setActive={setActive} isLoading={isLoading} />
          </form>
        </Stepper.Step>
        <Stepper.Completed>
          <Title order={2} size="h3" mb="lg">Vielen Dank für Deine Anfrage!</Title>
          <Text mb="sm">
            Wir haben Deine Angaben erhalten und melden uns in Kürze bei Dir.
          </Text>
          <Text mb="sm">
            <b>Bitte bestätigen Deine E-Mail-Adresse</b>, indem Du den Link in der gerade versendeten E-Mail anklickst. Sobald die Bestätigung erfolgt ist, melden wir uns bei Dir.
          </Text>
          <Text>
            Vielen Dank für Dein Vertrauen!
          </Text>
        </Stepper.Completed>
      </Stepper>
    </Modal>
  </>
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
          <Title order={1} ta={{ base: 'center', sm: 'left' }} fz={{ base: 34, xs: 42, sm: 60, md: 72 }} fw="bold" textWrap="balance">
            Einfach <span className={styles.gradientText}>Finden.</span><br/>
          </Title>
          <Title order={2} fz={{ base: 24, xs: 32, sm: 40, md: 48 }} ta={{ base: 'center', sm: 'left' }} mb="xl" fw={300}>
            Dein Budgetrechner.
          </Title>
          <Text size="lg" mb="xl" ta={{ base: 'center', sm: 'left' }}>
            Berechne schnell und einfach, wie viel Dich Dein Traumhaus kosten darf.
            Unser Budgetrechner kalkuliert anhand von Eigenkapital, Finanzierungszins und deiner persönlichen Wunschrate.
          </Text>
        </Box>

        {/* <Image
          radius="md"
          component={NextImage}
          src="/imgs/calculator2.jpg"
          alt="Leeres Grundstück von oben"
          height={250}
          width={250}
          w={250}
        /> */}
      </Flex>

      <Card mb="xl" ref={scollToRef}>
        <Flex justify="space-between" gap="md" direction={{ base: "column", sm: "row" }}>
          <Box w={{ base: "100%", sm: "67%" }}>
            <NumberInput
              label={<CustomLabel label="Dein Eigenkapital" desciption='Welche Summe an Kapital kannst Du in Dein Projekt "Traumhaus" mit einbringen?' />}
              placeholder="50 000€"
              decimalScale={0}
              min={0}
              thousandSeparator=" "
              suffix="€"
              mb="md"
              value={equity}
              hideControls
              onChange={(value) => setEquity(parseInt(value))}
            />

            <CustomLabel label="Deine Wunschrate" desciption="Welche monatliche Rate für die Finanzierung ist für Dich ideal?" />
            <Slider
              my="xl"
              labelAlwaysOn
              size="xl"
              min={100}
              max={5000}
              step={100}
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

            <CustomLabel label="Finanzierungszins" desciption="Hier stellst Du den Zinssatz für die Finanzierung ein." />
            <Slider
              my="xl"
              labelAlwaysOn
              size="xl"
              min={1}
              max={5}
              step={0.1}
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

            <CustomLabel label="Schuldenfrei in" desciption="Wann soll Dein Traumhaus komplett Dir gehören?" />
            <Slider
              my="xl"
              labelAlwaysOn
              size="xl"
              min={5}
              max={40}
              step={1}
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

          <Flex direction="column" justify="center" w={{ base: "100%", sm: "33%" }} ta={{ base: 'left', sm: 'center' }}>
            <Image
              component={NextImage}
              src={Logo}
              alt="ImmoRadar Logo"
              height={150}
              width={150}
              w={150}
              mb="md"
              mx="auto"
              display={{ base: "none", sm: "block" }}
            />
            <Text fw={500} mt="md" mb="sm" size="lg" ta="center">Gesamtbudget für Dein Projekt „Traumhaus“:</Text>
            <Text c="cyan.7" fw={600} size="2.8em" lh="1em" mb="sm" ta="center">
              <NumberFormatter
                suffix='€'
                value={calculateAnnuity()}
                thousandSeparator=" "
                decimalScale={0}
              />
            </Text>
          </Flex>

        </Flex>

        <ContactModal />
      </Card>


    </Layout>
  );
};

export default BudgetCalculator;