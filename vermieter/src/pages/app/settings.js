import Layout from '@/components/Layout/AppLayout'
import { fetcher } from '@/utils/fetcher'
import { Title, Flex, Loader, Card, Text, TextInput, NumberInput, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import React, { useState } from 'react'
import useSWR from 'swr'
import IBAN from 'iban'

function Settings() {
  const { data = {}, isLoading, mutate } = useSWR('/api/user', fetcher)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [hasIbanError, setHasIbanError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    setHasIbanError(false)

    const formObject = {};
    const elements = e.target.elements;
    for (let element of elements) {
      if (element.name) {
        formObject[element.name] = element.value;
      }
    }

    if (formObject.bankAccount && !IBAN.isValid(formObject.bankAccount)) {
      setHasIbanError(true)
      setSubmitLoading(false)
    } else {
      fetch('/api/user', { method: 'PUT', body: JSON.stringify(formObject) })
        .then(res => res.json())
        .then(() => {
          setSubmitLoading(false)
          notifications.show({
            title: 'Daten aktualisiert',
            message: 'Deine Daten wurden erfolgreich aktualisiert.',
            color: 'green',
            position: 'top-center',
          });
        })
    }
  }

  const cancelSubscription = (type) => {
    setCancelLoading(true)

    fetch(`/api/end-subscription?type=${type}`).then(() => {
      mutate()
      setCancelLoading(false)
      
      notifications.show({
        title: type === 'cancel' ? 'Abo gekündigt' : 'Kündigung rückgängig gemacht',
        message: type === 'cancel' ? 'Deine Abo erfolgreich gekündigt.' : 'Dein Abo ist wieder aktiv.',
        color: 'green',
        position: 'top-center',
      });
    })
  }

  const subEndDate = new Date(data?.susbcription_start_date * 1000)
  subEndDate.setFullYear(subEndDate.getFullYear() + 1)

  return (
    <Layout title="Einstellungen">
      <Title order={1} size="h3" weight={500} mb="xl">Einstellungen</Title>

      {isLoading && <Flex h="70vh" w="100%" align="center" justify="center">
        <Loader size={30} />
      </Flex>}

      {(!isLoading && data) && <>
        <Card withBorder shadow="md" mb="md">
          <Title order={2} size="h5">Deine Daten</Title>
          <Text fs="italic" mb="md">Diese Daten wurden deinem ersten Vertrag entnommen und werden bei neuen Verträgen automatisch eingesetzt.</Text>

          <form onSubmit={handleSubmit}>
            <Flex gap="sm">
              <TextInput
                label="Name"
                placeholder="Max Mustermann"
                mb="sm"
                name="landlordName"
                defaultValue={data.landlordName}
                w="100%"
              />
              <TextInput
                label="Straße und Hausnummer"
                placeholder="Beispielstr. 12"
                mb="sm"
                name="landlordStreet"
                defaultValue={data.landlordStreet}
                w="100%"
              />
            </Flex>
            <Flex gap="sm">
              <NumberInput
                label="Postleitzahl"
                placeholder="12345"
                mb="sm"
                name="landlordZip"
                defaultValue={data.landlordZip}
                hideControls
                decimalScale={0}
                maxLength={5}
                w="100%"
              />
              <TextInput
                label="Stadt"
                placeholder="Musterstadt"
                mb="sm"
                name="landlordCity"
                defaultValue={data.landlordCity}
                w="100%"
              />
            </Flex>
            <Flex gap="sm">
              <TextInput
                label="Vertreten durch"
                placeholder="Fertighaus Radar Property GmbH"
                mb="sm"
                name="landlordRepresentedBy"
                defaultValue={data.landlordRepresentedBy}
                w="100%"
              />
              <TextInput
                label="IBAN"
                placeholder="DE12 1234 1234 1234 1234 12"
                mb="sm"
                name="bankAccount"
                defaultValue={data.bankAccount}
                w="100%"
                error={hasIbanError && 'Iban ist ungültig'}
              />
            </Flex>


            <Button mt="md" type="submit" loading={submitLoading}>Daten aktualisieren</Button>
          </form>
        </Card>

        <Card withBorder shadow="md" mb="md">
          <Title order={2} size="h5">Deine Abo</Title>
          {!data.subscription_end_date && <>
            <Text fs="italic" mb="md">Wird automatisch am {subEndDate.toLocaleDateString('DE-de', { dateStyle: 'long' })} erneuert.</Text>
            <Button color="red.9" loading={cancelLoading} onClick={() => cancelSubscription('cancel')}>Abo zum Ende der Laufzeit kündigen</Button>
          </>}
          {data.subscription_end_date && <>
            <Text fs="italic" mb="md" c="red.9">Dein Abo endet am {new Date(data.subscription_end_date * 1000).toLocaleDateString('DE-de', { dateStyle: 'long' })}.</Text>
            <Button variant="outline" loading={cancelLoading} onClick={() => cancelSubscription('revert')}>Abo Kündigung rückgängig machen</Button>
          </>}
        </Card>
      </>}
    </Layout>
  )
}

export default Settings
