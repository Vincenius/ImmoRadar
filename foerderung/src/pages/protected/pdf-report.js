import { useEffect } from 'react';
import SubsidyReport from '@/components/SubsidyReport/SubsidyReport';

export async function getServerSideProps({ req, res, resolvedUrl }) {
  const headerValue = req.headers['x-api-key'];

  if (!headerValue || headerValue !== process.env.API_KEY) {
    return {
      redirect: {
        destination: '/foerdercheck',
        permanent: false,
      },
    };
  }

  const params = new URLSearchParams(resolvedUrl.split('?')[1]);
  const id = params.get('id');
  const baseUrl = process.env.BASE_URL

  const data = await fetch(`${baseUrl}/api/subsidies?id=${id}`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json())

  return {
    props: { data, baseUrl },
  };
}

const PdfReport = ({ data, baseUrl }) => {
  useEffect(() => {
    document.body.style.backgroundColor = 'white';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return <SubsidyReport data={data} isPdf={true} baseUrl={baseUrl} />;
};

export default PdfReport;
