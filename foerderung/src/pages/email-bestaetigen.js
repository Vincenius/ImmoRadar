import React, { useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'

export async function getServerSideProps({ resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');

  return {
    props: { id },
  };
}

function CheckoutReturn({ id }) {
  useEffect(() => {
    fetch('/api/confirm', {
      method: 'POST',
      body: JSON.stringify({ id })
    }).then(res => res.json())
      .then(res => window.location.href = `/report?id=${id}&confirmed=${res.success}`)
  })

  return (
    <div>
      <LoadingOverlay visible={true} />
    </div>
  )
}

export default CheckoutReturn
