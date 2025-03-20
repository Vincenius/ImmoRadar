import React, { useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'

export async function getServerSideProps({ resolvedUrl }) {
  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const session_id = params.get('session_id');

  return {
    props: { session_id },
  };
}

// http://localhost:3000/checkout/return?session_id=cs_test_a1Wie5YcU92d5idYlLZn7SQ9ebWZyTcQIk2v0NAKtpZ61AiVRZdzwSA3Td -> one time
// http://localhost:3000//checkout/return?session_id=cs_test_a1NkNKQCLPerqKUN3b6cHQM4iKg07zXvcM6tckYzhHAq9026gcJn26IMp3 -> subscription


function CheckoutReturn({ session_id }) {
  useEffect(() => {
    fetch('/api/checkout/return', {
      method: 'POST',
      body: JSON.stringify({ session_id })
    }).then(res => res.json())
    // Todo success false and error handling
    .then(({ id, stripe_id, isSubscription }) => {
      console.log(id, stripe_id, isSubscription)
      if (!isSubscription) {
        window.location.href = `/download?token=${id}`
      } else {
        window.location.href = `/download-registrieren?token=${id}&stripe_id=${stripe_id}`
      }
    })
  })

  return (
     <div>
        <LoadingOverlay visible={true} />
     </div>
  )
}

export default CheckoutReturn
