import Layout from '@/components/Layout/Layout';
import { Container, Title, Text, List } from '@mantine/core';
import styles from '@/styles/Privacy.module.css';

const Privacy = () => {
    return <Layout
        title="AGBs"
        description={`AGBs von ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}
        withBackground={true}
        noindex={true}
    >
        <Container my="xl">
            <Title order={1} my="xl">AGBs</Title>
        </Container>
    </Layout>
};

export default Privacy;