import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import NextImage from 'next/image';
import { Flex, Text, Group, Button, Title, Box, TextInput, Stepper, Table, Chip, Select, Card, NumberFormatter, Image } from '@mantine/core';
import { IconHome, IconBackhoe, IconCheck } from '@tabler/icons-react'
import SelectButton from '@/components/Inputs/SelectButton';
import Layout from '@/components/Layout/Layout'
import { bundeslaender } from '@/utils/bundeslaender'
import CheckboxCard from '@/components/Inputs/CheckboxCard';
import trackEvent from '@/utils/trackEvent';
import Pricing from '@/components/Pricing/Pricing';
import Checkout from '@/components/Checkout/Checkout';
import { showNotification } from '@mantine/notifications';

export async function getServerSideProps({ resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  if (!id) {
    const subsidyData = await fetch(`${baseUrl}/api/subsidies`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.API_KEY
      }
    }).then(res => res.json())
    return {
      props: { subsidyData },
    };
  }

  const [data, subsidyData] = await Promise.all([
    fetch(`${baseUrl}/api/subsidies?id=${id}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.API_KEY
      }
    }).then(res => res.json()),
    fetch(`${baseUrl}/api/subsidies`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.API_KEY
      }
    }).then(res => res.json()),
  ])

  return {
    props: { defaultData: data, subsidyData, baseUrl },
  };
}

const SelectChip = ({ children, data, setData, value, ...props }) => {
  const handleChange = () => {
    setData({
      ...data,
      Measures: data['Measures']?.includes(value)
        ? data['Measures']?.filter((m) => m !== value)
        : [...(data['Measures'] || []), value]
    })
  }
  return (
    <Chip
      size="lg"
      variant="outline"
      styles={{ root: { flexGrow: 1 }, label: { width: '100%', justifyContent: 'center' } }}
      checked={data['Measures']?.includes(value)}
      onChange={handleChange}
      {...props}
    >
      {children}
    </Chip>
  )
}

const numberFormatElements = ['Postalcode']

const ButtonGroup = ({ active, setActive, isLoading, hasSubmit, disabled }) => {
  return <Group justify="space-between" mt="xl">
    {active === 0 && <div></div>}
    {active > 0 && <Button variant="default" onClick={() => setActive(active - 1)} loading={isLoading}>Zurück</Button>}
    {active < 4 && <Flex gap="sm">
      {hasSubmit && <Button type="submit" loading={isLoading} disabled={disabled}>
        {active === 3 ? 'Ergebnis anzeigen' : 'Weiter'}
      </Button>}
    </Flex>}
  </Group>
}

export default function Foerderung({ defaultData = {}, subsidyData, baseUrl }) {
  const defaultUser = defaultData?.user
  const hasDefaultData = !!defaultUser?.uuid

  const router = useRouter()
  const [active, setActive] = useState(hasDefaultData ? 4 : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    TypZuschuss: defaultUser?.Types?.includes('Zuschuss') || true,
    TypKredit: defaultUser?.Types?.includes('Kredit') || true,
    HouseType: defaultUser?.HouseType || null,
    Region: defaultUser?.Region || null,
    District: defaultUser?.District || null,
    Measures: defaultUser?.Measures || []
  })
  const [email, setEmail] = useState(defaultUser?.Email || '')
  const [showCheckout, setShowCheckout] = useState(false)
  const [variant, setVariant] = useState()
  const [checkoutId, setCheckoutId] = useState()
  const [emailSuccess, setEmailSuccess] = useState(false)

  const selectOption = (e) => {
    let elem = e.target
    while (!elem.name) {
      elem = elem.parentElement
    }
    setData({ ...data, [elem.name]: elem.value })
    setActive(active + 1)
  }

  const handleSubmitNext = (e) => {
    e.preventDefault();
    setActive(active + 1)
  }

  const districtData = [...new Set(
    subsidyData
      .filter(d => d.Region === data.Region && d.District)
      .map(d => d.District)
  )].sort()

  const measuresData = [...new Set(
    subsidyData.filter(d =>
      d.HouseType.includes(data.HouseType) &&
      (d.Region === data.Region || d.Region === 'Bundesweit') &&
      (d.District === data.District || !d.District) &&
      (
        data.TypZuschuss && d.Type.includes('Zuschuss') ||
        data.TypKredit && d.Type.includes('Kredit')
      )
    ).map(d => d.Measures).flat().filter(Boolean)
  )].sort()

  const finalData = subsidyData.filter(d =>
    d.HouseType.includes(data.HouseType) &&
    (d.Region === data.Region || d.Region === 'Bundesweit') &&
    (d.District === data.District || !d.District) &&
    (
      data.TypZuschuss && d.Type.includes('Zuschuss') ||
      data.TypKredit && d.Type.includes('Kredit')
    ) &&
    d.Measures?.some(element => data.Measures?.includes(element))
  )

  const finalDataAmount = finalData.reduce((acc, curr) => {
    const subAmount = data.Measures.reduce((subAcc, subCurr) => {
      return subAcc + curr.FundingDetails[subCurr]
    }, 0)
    return acc + subAmount
  }, 0)

  const handleSubmit = (e) => {
    e.preventDefault();

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name) {
        if (numberFormatElements.includes(element.name)) {
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

    setData(newData)
    setActive(active + 1)
  }

  const handleSubmitReport = (e) => {
    e.preventDefault()
    trackEvent('foerdercheck-generate-free-report')
    setIsLoading(true)
    fetch('/api/subsidies', {
      method: 'POST',
      body: JSON.stringify({ data, email })
    })
      .then(res => res.json())
      .then(res => {
        showNotification({
          title: 'Report erfolgreich zugestellt!',
          message: 'Dein Report wurde erstellt und dir als PDF per E-Mail zugesendet.',
          color: 'green',
          position: 'top-center'
        });
        setEmailSuccess(true)
      })
      .catch(() => console.log('error')) // todo error handling
      .finally(() => setIsLoading(false))
  }

  const goToCheckout = () => {
    trackEvent('foerdercheck-go-to-checkout')
    setShowCheckout(true)
  }

  const goToPayment = (newVariant) => {
    setVariant(newVariant)
    setIsLoading(true)
    fetch('/api/subsidies', {
      method: 'POST',
      body: JSON.stringify({ data })
    })
      .then(res => res.json())
      .then(res => {
        setCheckoutId(res.id)
      })
      .catch(() => console.log('error')) // todo error handling
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout
      title="Dein FörderCheck"
      description="Teile uns ein paar Informationen zu deinem Vorhaben mit und beantworte gezielte Fragen. So stellen wir sicher, dass du nur passende Förderprogramme erhältst."
    >
      <Card my="xl" p="0">
        <Stepper
          active={active}
          onStepClick={setActive}
          size="1px"
          styles={{ separator: { marginInline: 0 }, stepIcon: { color: 'transparent' } }}
          allowNextStepsSelect={false}
        >
          <Stepper.Step>
            <Box p="xl">
              <Title order={2} size="h3" mb="xl" ta="center">Handelt es sich um eine Bestandsimmobilie oder einen Neubau?</Title>

              <Flex gap="md">
                <SelectButton name="HouseType" value="Bestand" onClick={selectOption} fullWidth isMultiLine={true}>
                  <Flex direction="column" gap="sm" align="center">
                    <IconHome size="2em" />
                    <Text fw="600" size="lg">Bestand</Text>
                  </Flex>
                </SelectButton>
                <SelectButton name="HouseType" value="Neubau" onClick={selectOption} fullWidth isMultiLine={true}>
                  <Flex direction="column" gap="sm" align="center">
                    <IconBackhoe size="2em" />
                    <Text fw="600" size="lg">Neubau</Text>
                  </Flex>
                </SelectButton>
              </Flex>

              <ButtonGroup {...{ data, setData, active, setActive }} />
            </Box>
          </Stepper.Step>
          <Stepper.Step>
            <Box p="xl">
              <form onSubmit={handleSubmitNext}>
                <Title order={2} size="h3" mb="xl" ta="center">Welche Art der Förderung suchen Sie?</Title>
                <Flex gap="md" direction={{ base: 'column', xs: 'row' }}>
                  <CheckboxCard handleChange={() => setData({ ...data, TypZuschuss: !data.TypZuschuss })} value={data.TypZuschuss} title="Zuschuss" />
                  <CheckboxCard handleChange={() => setData({ ...data, TypKredit: !data.TypKredit })} value={data.TypKredit} title="Kredit" />
                </Flex>
                <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={!data.TypZuschuss && !data.TypKredit} />
              </form>
            </Box>
          </Stepper.Step>
          <Stepper.Step>
            <Box p="xl">
              <Title order={2} size="h3" mb="xl" ta="center">Wo liegt die Immobilie oder wo planen Sie zu bauen?</Title>

              <form onSubmit={handleSubmit}>
                <Flex gap="md" direction={{ base: 'column', xs: 'row' }} align="flex-start">
                  <Select
                    label="Bundesland"
                    data={bundeslaender}
                    required
                    mb="sm"
                    name="Region"
                    onChange={(value) => setData({ ...data, Region: value, District: null })}
                    value={data.Region}
                    size="lg"
                    w="100%"
                  />

                  <Box w="100%">
                    <Select
                      label="Kreis/Landkreis (optional)"
                      data={districtData || []}
                      placeholder={!data.Region ? 'Zuerst Bundesland auswählen' : !districtData || !districtData.length ? 'Keine Kreise vorhanden' : 'Kreis auswählen'}
                      mb="xs"
                      name="District"
                      onChange={(value) => setData({ ...data, District: value })}
                      value={data.District}
                      disabled={!districtData || !districtData.length}
                      size="lg"
                    />
                    <Text c="gray.7" size="sm">Für einige Bundesländer gibt es spezifische Förderungen einzelner Kreise/Landkreise.</Text>
                  </Box>
                </Flex>

                <ButtonGroup active={active} setActive={setActive} hasSubmit disabled={!data.Region} />
              </form>
            </Box>
          </Stepper.Step>
          <Stepper.Step>
            <Box p="xl">
              <Title order={2} size="h3" mb="xl" ta="center">Welche Maßnahmen planen Sie?</Title>

              <Chip
                checked={data.Measures?.length === measuresData.length}
                onChange={() => data.Measures?.length === measuresData.length
                  ? setData({ ...data, Measures: [] })
                  : setData({ ...data, Measures: measuresData })
                }
                size="lg"
                mb="md"
                radius="sm"
                styles={{ label: { width: '100%', justifyContent: 'center' } }}
              >
                Alle auswählen
              </Chip>

              <form onSubmit={handleSubmit}>
                <Flex gap="sm" wrap="wrap">
                  {measuresData.map((m) => (
                    <SelectChip radius="sm" key={m} value={m} {...{ data, setData }}>{m}</SelectChip>
                  ))}
                </Flex>
                <ButtonGroup {...{ data, setData, active, setActive }} hasSubmit disabled={(data.Measures || []).length === 0} />
              </form>
            </Box>
          </Stepper.Step>
          <Stepper.Completed>
            <Box p="md">
              {!showCheckout && <>
                <Title order={2} size="h3" mb="xl" ta="center" textWrap="balance">
                  Wir konnten {finalData.length} Förderungen mit einer maximalen Fördersumme von <NumberFormatter suffix="€" value={finalDataAmount} thousandSeparator="." decimalSeparator="," decimalScale={0} /> für die eingestellten Kriterien finden.
                </Title>

                <Table mb="xl" striped>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Th>Förderung & Webseite</Table.Th>
                      {data.TypZuschuss && data.TypKredit && <Table.Th>Art der Förderung</Table.Th>}
                      <Table.Th>Maßnahmen</Table.Th>
                    </Table.Tr>
                    {finalData.map((d, index) => (
                      <Table.Tr key={d.Id}>
                        <Table.Td><a href={d.Website} target="_blank" rel="noopener noreferrer">{d.Name}</a></Table.Td>
                        {data.TypZuschuss && data.TypKredit && <Table.Td>{d.Type.join(', ')}</Table.Td>}
                        <Table.Td>{d.Measures.filter(m => data.Measures.includes(m)).join(', ')}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

                <Card p="md" withBorder>
                  <Flex gap="md" direction={{ base: "column", sm: "row" }}>
                    <Image
                      radius="md"
                      component={NextImage}
                      src="/imgs/illustration-document.png"
                      alt="Illustration Dokument"
                      height={200}
                      width={400}
                      w={{ base: 200, sm: "auto" }}
                      h={200}
                      mx="auto"
                    />
                    <Box>
                      <Title size="h4" order={3} mb="md">Erspare dir stundenlange Recherche mit unserem Premium-Report</Title>
                      <Text mb="lg" fs="italic">Im Premium-Report findest du alle wichtigen Details zu Förderungen und kurze Fragebögen, die dir sofort zeigen, ob du für die Förderung berechtigt bist.</Text>
                      <Button variant="light" onClick={goToCheckout}>
                        Mehr erfahren
                      </Button>
                    </Box>
                  </Flex>
                </Card>

                <Text ta="center" my="md">- oder -</Text>

                <Card p="md" withBorder mb="xl">
                  <Flex gap="md" direction={{ base: "column", sm: "row" }}>
                    <Image
                      radius="md"
                      component={NextImage}
                      src="/imgs/illustration-email.png"
                      alt="Illustration Dokument"
                      height={200}
                      width={400}
                      w={{ base: 200, sm: "auto" }}
                      h={200}
                      mx="auto"
                    />
                    <form onSubmit={handleSubmitReport}>
                      <Title size="h4" order={3} mb="md">Erhalte jetzt deinen kostenlosen Report als PDF per E-Mail</Title>

                      <Flex
                        align={{ base: "flex-start", sm: "center" }}
                        gap="md"
                        direction={{ base: "column", sm: "row" }}
                        mb={{ base: "md", sm: "0" }}
                      >
                        <TextInput
                          required
                          label="E-Mail Adresse"
                          placeholder="mustermann@example.com"
                          mb={{ base: "0", sm: "md" }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          miw={{ base: "100%", sm: "250px" }}
                        />

                        <Button type="submit" loading={isLoading} mt={{ base: "0", sm: "0.6em" }} disabled={emailSuccess}>
                          {emailSuccess ? <IconCheck /> : "Report zusenden"}
                        </Button>
                      </Flex>
                      <Text size="xs" fs="italic">Mit dem Absenden stimmst du unserer Datenschutzerklärung zu und willigst ein, dass wir dir das angeforderte PDF sowie unseren Newsletter per E-Mail zusenden. Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.</Text>
                    </form>
                  </Flex>
                </Card>

                <Button
                  variant="default" w="30%"
                  onClick={() => setActive(active - 1)}
                >Zurück</Button>
              </>}


              {showCheckout && <>
                <Title order={2} size="h3" mb="xl" ta="center" textWrap="balance">
                  Premium Report kaufen
                </Title>
                {(!variant || !checkoutId) && <>
                  <Pricing
                    plan="free"
                    CtaPremium={<Button mt="lg" onClick={() => goToPayment('premium')} loading={isLoading}>
                      Jetzt Kaufen
                    </Button>}
                    CtaProfessional={<Button mt="lg" variant="outline" onClick={() => goToPayment('professional')} loading={isLoading}>
                      Jetzt Kaufen
                    </Button>}
                  />

                  <Button
                    variant="default" w="30%"
                    onClick={() => setShowCheckout(false)}
                  >Zurück</Button>
                </>}
                {(variant && checkoutId) && <>
                  <Checkout variant={variant} id={checkoutId} />
                  <Button mt="lg" variant="outline" onClick={() => {
                    setVariant(null)
                    setCheckoutId(null)
                  }} w="150px">Zurück</Button>
                </>}
              </>}
            </Box>
          </Stepper.Completed>
        </Stepper>
      </Card>
    </Layout>
  );
}
