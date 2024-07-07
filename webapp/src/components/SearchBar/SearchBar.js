import React, { useEffect, useState } from 'react';
import useSWR from 'swr'
import { Autocomplete } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/utils/fetcher';
import styles from './SearchBar.module.css'

const SearchBar = ({ defaultValue = '' }) => {
    const router = useRouter()
    const { data = [] } = useSWR('/api/autocomplete', fetcher)
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])

    return (
        <Autocomplete
            value={value} onChange={setValue}
            data={data.map(o => o.name)}
            comboboxProps={{ shadow: 'md' }}
            limit={10}
            className={styles.input}
            placeholder="Ort / Stadt / Bezirk Suchen"
            size="lg"
            w="100%"
            onOptionSubmit={(value) => router.push('/search?q=' + encodeURI(value))}
            // submit on enter
            onKeyUp={(e) => {
                if (e.key === 'Enter' && e.target.value && e.target.value.length > 2){
                    router.push('/search?q=' + encodeURI(e.target.value) + '&input=manual')}
                }
            }
        />
    );
};

export default SearchBar;