import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flex, Text, Group, ThemeIcon, Title, Box, Autocomplete } from '@mantine/core';
import { IconClock, IconList, IconBell } from '@tabler/icons-react';
import Layout from '@/components/Layout/Layout'
import Logos from '@/components/Logos/Logos'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const router = useRouter()
  const [autocompleOptions, setAutocompleteOptions] = useState([]) // todo add defaults

  useEffect(() => {
    fetch('/api/autocomplete')
      .then(res => res.json())
      .then(data => {
        setAutocompleteOptions(data)
      })
  }, [])

  return (
    <Layout
      title="ImmoRadar | Alle Immobilienangebote an einem Ort"
      description="Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten."
    >
      Search page
    </Layout>
  );
}
