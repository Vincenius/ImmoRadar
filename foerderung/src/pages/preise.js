import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Title, Box, Button, Text } from '@mantine/core';
import PricingComponent from '@/components/Pricing/Pricing';
import Link from 'next/link';

const Pricing = () => {
  return (
    <Layout
      title="Preise"
      withBackground={true}
    >
      <Box m="xl">
        <Title order={2} ta="center" mb="md" size="h1">Weniger zahlen, mehr bauen!</Title>
        <Box maw="550px" mx="auto">
          <Text my="md" ta="center">
            In nur wenigen Sekunden zeigt Dir der Förderreport, wie Du bei der Sanierung oder
            beim Neubau mehr rausholst, ohne mehr zu investieren. Eine kleine Ausgabe –
            mit riesigem Potenzial.
          </Text>
          <Text mb="xl" ta="center">
            Hol Dir jetzt Dein Extra Geld für Dein Zuhause!
          </Text>
        </Box>
        
        <PricingComponent
          showFree
          plan="free"
          CtaStarter={<Button size="md" component={Link} href="/foerdercheck" fullWidth>
            Jetzt starten!
          </Button>}
          CtaPremium={<Button size="md" component={Link} href="/foerdercheck" fullWidth>
            Jetzt starten!
          </Button>}
          CtaPremiumPlus={<Button size="md" fullWidth disabled>
            Mit Premium Verfügbar
          </Button>}
        />
      </Box>

    </Layout>
  );
};

export default Pricing;