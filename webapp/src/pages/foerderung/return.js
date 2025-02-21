import React, { useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'

export async function getServerSideProps({ resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const session_id = params.get('session_id');

  return {
    props: { session_id },
  };
}

function CheckoutReturn({ session_id }) {
  useEffect(() => {
    fetch('/api/checkout/return', {
      method: 'POST',
      body: JSON.stringify({ session_id })
    }).then(res => res.json())
    .then(res => window.location.href = `/foerderung/report?id=${res.id}&paid_success=${res.success}`)
  })

  return (
     <div>
      <LoadingOverlay visible={true} />
     </div>
  )
}

export default CheckoutReturn
