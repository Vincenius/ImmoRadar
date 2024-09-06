import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { Autocomplete, Flex, ActionIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
import { useRouter } from 'next/navigation';
import { fetcher } from '@/utils/fetcher';
import Filter from '@/components/Filter/Filter';
import styles from './SearchBar.module.css'

const SearchBar = ({ defaultValue = '', city, showFilter }) => {
    const router = useRouter()
    const { data = [] } = useSWR('/api/autocomplete', fetcher)
    const [value, setValue] = useState(defaultValue);
    const [filterQuery, setFilterQuery] = useState({})
    const [filterModalOpen, { open: openFilterModal, close: closeFilterModal }] = useDisclosure(false);
    const searchParams = useSearchParams()

    const applyFilter = (filter) => {
        const query = { ...filter }
        query.features = query.features.join(',')
        query.providers = query.providers.join(',')
        query.titleIncludes = query.titleIncludes.join(',')
        query.titleExcludes = query.titleExcludes.join(',')
        closeFilterModal()
        setFilterQuery(filter)
    }

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])

    const handleSearch = ({ value, manual = false }) => {
        const defaultSearchParams = {}
        for (const [key, value] of searchParams.entries()) {
            defaultSearchParams[key] = value
        }
        const query = showFilter
            ? { q: value, ...filterQuery }
            : { ...defaultSearchParams, q: value, page: 1 }

        Object.keys(query).forEach(key => !query[key] && delete query[key])
        if (manual) {
            query.input = 'manual';
        }
        router.push({ pathname: '/search', query });
    }

    return (
        <Flex w="100%">
            <Autocomplete
                value={value} onChange={setValue}
                data={data.map(o => o.name)}
                comboboxProps={{ shadow: 'md' }}
                limit={10}
                className={showFilter ? styles.inputWithFilter : styles.input}
                placeholder={ city ? "Bezirk / PLZ Suchen" : "Ort / Stadt / Bezirk / PLZ Suchen" }
                size="lg"
                w="100%"
                onOptionSubmit={(value) => handleSearch({ value })}
                // submit on enter
                onKeyUp={(e) => {
                    if (e.key === 'Enter' && e.target.value && e.target.value.length > 2){
                        handleSearch({ value, manual: true })
                    }
                }}
            />
            { showFilter && <ActionIcon
                bg="white"
                variant="outline"
                aria-label="Filter"
                w={50} h={50}
                className={styles.filterButton}
                onClick={openFilterModal}
            >
                <IconAdjustmentsHorizontal style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon> }
            <Modal opened={filterModalOpen} onClose={closeFilterModal} title="Filter">
                <Filter applyFilter={applyFilter} defaultFilter={filterQuery} />
            </Modal>
        </Flex>
    );
};

export default SearchBar;