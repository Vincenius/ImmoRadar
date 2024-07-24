import { useEffect } from 'react';
import useSWR from 'swr'
import { useRouter } from 'next/router';
import { Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Layout from '@/components/Layout/Layout';
import { fetcher } from '@/utils/fetcher';

const Profile = () => {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const { confirm } = router.query;
        if (confirm === 'true') {
            const { pathname, query } = router;
            notifications.show({
                title: 'E-Mail bestätigt',
                message: 'Vielen Dank! Deine E-Mail-Adresse wurde bestätigt.',
                color: 'green',
            });
            // Remove the confirm query param from the URL
            const params = new URLSearchParams(query);
            params.delete('confirm');
            router.replace(
                { pathname, query: params.toString() },
                undefined,
                { shallow: true }
            );
        }
    }, [router.query]);

    const { data = {}, error, isLoading } = useSWR(`/api/profile?token=${id}`, fetcher)
    console.log(data)

    return (
        <Layout title="ImmoRadar | Deine Benachrichtigungen" description="Verwalte deine Benachrichtigungen">
            <Title pt="xl">Deine Benachrichtigungen</Title>
            {/* todo show user notification settings -> tiles with edit & remove buttons */}
            {/* todo show user active switch */}
            {/* todo show delete user button */}
        </Layout>
    );
};

export default Profile;